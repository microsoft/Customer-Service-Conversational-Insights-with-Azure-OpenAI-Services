using AutoMapper;
using DnsClient.Internal;
using Microsoft.GS.DPS.Images;
using Microsoft.GS.DPS.Model.KernelMemory;
using Microsoft.GS.DPS.Storage.Document;
using Microsoft.KernelMemory;
using Microsoft.KernelMemory.Context;
using Microsoft.KernelMemory.Pipeline;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Document = Microsoft.GS.DPS.Storage.Document.Entities.Document;
using Microsoft.GS.DPS.API.UserInterface;
using Microsoft.GS.DPS.Storage.AISearch;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Microsoft.GS.DPS.API
{
    public class KernelMemory
    {
        private MemoryWebClient _kmClient;
        private DocumentRepository _documentRepository;
        private DataCacheManager _dataCache;
        private TagUpdater _tagUpdator;
        private static string keywordExtractorPrompt = "";

        static KernelMemory()
        {
            //Set Location of the System Prompt under running Assembly directory location.
            var assemblyLocation = Assembly.GetExecutingAssembly().Location;
            var assemblyDirectory = System.IO.Path.GetDirectoryName(assemblyLocation);
            // binding assembly directory with file path (Prompts/KeywordExtract_SystemPrompt.txt)
            var systemPromptFilePath = System.IO.Path.Combine(assemblyDirectory, "Prompts/KeywordExtract_SystemPrompt.txt");
            KernelMemory.keywordExtractorPrompt = System.IO.File.ReadAllText(systemPromptFilePath);
        }

        public KernelMemory(MemoryWebClient kmClient, DocumentRepository documentRepository, DataCacheManager dataCache, TagUpdater tagUpdator)
        {
            _kmClient = kmClient;
            _documentRepository = documentRepository;
            _dataCache = dataCache;
            _tagUpdator = tagUpdator;
        }

        public async Task<DocumentImportedResult> ImportDocument(Stream documentStream,
                                                                 string fileName, 
                                                                 string contentType)
        {
            // Implementation of the file upload
            var documentId = await _kmClient.ImportDocumentAsync(documentStream, fileName, steps: [
                                    Constants.PipelineStepsExtract,
                                    "keyword_extract",
                                    Constants.PipelineStepsSummarize,
                                    Constants.PipelineStepsPartition,
                                    Constants.PipelineStepsGenEmbeddings,
                                    Constants.PipelineStepsSaveRecords
                            ]);
            // Check the processing status of the document with Timeout 3mins
            var startTime = DateTime.Now;
            var elapsedTime = DateTime.Now - startTime;

            // Set Timeout 60 mins - Document Processing Time
            var timeout = TimeSpan.FromMinutes(60);

            while (true)
            {
                var isReady = await _kmClient.IsDocumentReadyAsync(documentId);
                if (isReady) break;

                await Task.Delay(5000);
                elapsedTime = DateTime.Now - startTime;
                if (elapsedTime > timeout)
                {
                    throw new TimeoutException("Document processing timeout");
                }
            }

            var importedResult = new DocumentImportedResult
            {
                DocumentId = documentId,
                ImportedTime = DateTime.UtcNow,
                MimeType = contentType,
                FileName = fileName,
                ProcessingTime = elapsedTime,
                Keywords = await getKeywords(documentId, fileName),
                Summary = await getSummary(documentId, fileName)
            };


            // Save the document to the repository
            Document document = new Document
            {
                DocumentId = documentId,
                FileName = fileName,
                ImportedTime = importedResult.ImportedTime,
                MimeType = contentType,
                ProcessingTime = importedResult.ProcessingTime,
                Summary = importedResult.Summary,
                Keywords = importedResult.Keywords
            };

            await _documentRepository.RegisterAsync(document);

            //Cache Refresh
            _dataCache.ManualRefresh();

            return importedResult;
        }

        public async Task<bool> DeleteDocument(string documentId)
        {
            if (string.IsNullOrEmpty(documentId))
            {
                throw new ArgumentException("DocumentId is required");
            }

            // DeleteAsync the document from the repository
            Document registeredDocument = await _documentRepository.FindByDocumentIdAsync(documentId);
            //var document = registeredDocument.Results.FirstOrDefault();
            if (registeredDocument != null)  await _documentRepository.DeleteAsync(registeredDocument.id);
            
            // DeleteAsync the document from the Kernel Memory
            await _kmClient.DeleteDocumentAsync(documentId);

            return true;
        }


        private async Task<string> getSummary(string documentId, string fileName)
        {
            // Summary file
            var summaryFileName = $"{fileName}.summarize.0.txt";
            // Download Summary file
            var summaryFile = await _kmClient.ExportFileAsync(documentId, summaryFileName);
            var summaryFileStream = await summaryFile.GetStreamAsync();
            // Read Stream to string
            return await new StreamReader(summaryFileStream).ReadToEndAsync();
        }


        private async Task<Dictionary<string, string>?> getKeywords(string documentId, string fileName)
        {
            // Get Keyword file
            var keywordFileName = $"{fileName}.tags.json";
            // Download Keyword file
            var keywordFile = await _kmClient.ExportFileAsync(documentId, keywordFileName);
            var keywordFileStream = await keywordFile.GetStreamAsync();
            // Read Stream to string
            string? keywordContent = await new StreamReader(keywordFileStream).ReadToEndAsync();

            if (string.IsNullOrEmpty(keywordContent))
            {
                return new Dictionary<string,string>();
            }else
            {
                // Read the keyword file then parse to KeyValuePair<string, string[]>
                try
                {
                    var result =  JsonSerializer.Deserialize<List<Dictionary<string, List<string>>>>(keywordContent);

                    if (result.Count == 0)
                    {
                        //Just in case the document is large, get keywords via KM.
                        var answer = await _kmClient.AskAsync(question: KernelMemory.keywordExtractorPrompt, filters: new List<MemoryFilter> { new MemoryFilter().ByDocument(documentId) });
                        result = JsonSerializer.Deserialize<List<Dictionary<string, List<string>>>>(answer.Result);
                        var listKeyValueString = new List<string>();
                        foreach (var dict in result)
                        {
                            foreach (var kvp in dict)
                            {
                                foreach (var value in kvp.Value)
                                {
                                    listKeyValueString.Add($"{kvp.Key.Trim()}:{value.Trim()}");
                                }
                            }
                        }
                        //Update Azure Search tags collection.
                        await _tagUpdator.UpdateTags(documentId, listKeyValueString);
                    }

                    //convert result to Dictionary<string, string>
                    var keywordDict = new Dictionary<string, string>();

                    foreach (var item in result)
                    {
                        foreach (var key in item.Keys)
                        {
                            keywordDict.Add(key, string.Join(", ", item[key]));
                        }
                    }

                    return keywordDict;
                }
                catch (Exception ex)
                {
                    return new Dictionary<string, string>();
                }
            }
        }

        public async Task<MemoryAnswer> Ask(string question, string[] documents, ICollection<MemoryFilter>? filters = null, RequestContext? context = null)
        {
            ICollection<MemoryFilter>? memFilters = null;

            if (documents.Length > 0)
            {
                memFilters = new List<MemoryFilter>();
                foreach (var documentId in documents)
                {
                    memFilters.Add(new MemoryFilter().ByDocument(documentId));
                }
            }

            var answer = await _kmClient.AskAsync(question: question, filters: memFilters, context: context, minRelevance: 0.012);
            return answer;
        }

        public async Task<StreamableFileContent> ExportFile(string documentId, string fileName)
        {
            var fileContent = await _kmClient.ExportFileAsync(documentId, fileName);
            return fileContent;
        }

        
    }
}
