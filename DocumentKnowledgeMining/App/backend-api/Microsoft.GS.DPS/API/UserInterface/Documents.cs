using Microsoft.GS.DPS.Storage.Document;
using Entities = Microsoft.GS.DPS.Storage.Document.Entities;
using Microsoft.KernelMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.GS.DPS.Storage.Document.Entities;
using System.Reflection.Metadata;
using System.Text.Json;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
namespace Microsoft.GS.DPS.API.UserInterface
{
    public class Documents
    {
        private readonly DocumentRepository _documentRepository;
        private readonly MemoryWebClient _memoryWebClient;
        private readonly DataCacheManager _dataCache;

        public Documents(DocumentRepository documentRepository, MemoryWebClient memoryWebClient, DataCacheManager dataCache)
        {
            _documentRepository = documentRepository;
            _memoryWebClient = memoryWebClient;
            _dataCache = dataCache;
        }

        private async Task<QueryResultSet> GetAllDocumentsByPageAsync(int pageNumber, 
                                                                      int pageSize, 
                                                                      DateTime? startDate, 
                                                                      DateTime? endDate)
        {
            return await _documentRepository.GetAllDocumentsByPageAsync(pageNumber, pageSize, startDate, endDate);
        }


        public async Task<Model.UserInterface.DocumentQuerySet> GetDocuments(int pageNumber, 
                                                                             int pageSize, 
                                                                             DateTime? startDate, 
                                                                             DateTime? endDate)
        {
            var resultSet = await this.GetAllDocumentsByPageAsync(pageNumber, pageSize,startDate, endDate);
            //var keywordFilterInfo = GetConsolidatedKeywords(resultSet.Results);
            //var keywordFilterInfo = await GetConsolidatedKeywords();
            var keywordFilterInfo = await _dataCache.GetConsolidatedKeywordsAsync();


            return new Model.UserInterface.DocumentQuerySet
            {
                documents = resultSet.Results,
                keywordFilterInfo = keywordFilterInfo,
                TotalPages = resultSet.TotalPages,
                CurrentPage = resultSet.CurrentPage,
                TotalRecords = resultSet.TotalRecords
            };
        }

        public async Task<Entities.Document> GetDocument(string documentId)
        {
            return await _documentRepository.FindByDocumentIdAsync(documentId);
        }

        //public async Task<Model.UserInterface.DocumentQuerySet> GetDocumentsByDocumentIds(string[] documentIds)
        //{
        //    var documents = await _documentRepository.FindByDocumentIdsAsync(documentIds);
        //    return new Model.UserInterface.DocumentQuerySet
        //    {
        //        documents = documents.Results,
        //        keywordFilterInfo = GetConsolidatedKeywords(documents.Results),
        //        TotalPages = documents.TotalPages,
        //        CurrentPage = documents.CurrentPage,
        //        TotalRecords = documents.TotalRecords
        //    };
        //}

        //public async Task<Model.UserInterface.DocumentQuerySet> GetDocumentsByTagAsync(Dictionary<string,string> tags, int pageNumber, int pageSize)
        //{
        //    var documents = await _documentRepository.FindByTagsAsync(tags, pageNumber, pageSize);

        //    return new Model.UserInterface.DocumentQuerySet
        //    {
        //        documents = documents.Results,
        //        keywordFilterInfo = GetConsolidatedKeywords(documents.Results),
        //        TotalPages = documents.TotalPages,
        //        CurrentPage = documents.CurrentPage,
        //        TotalRecords = documents.TotalRecords
        //    };
        //}

        //private async Task<string> DownloadSummaryFromBlob(string documentId, string fileName)
        //{
        //    StreamableFileContent file = await _memoryWebClient.ExportFileAsync(documentId, $"{fileName}.summarize.0.txt");
        //    Stream summarizedFileStream = await file.GetStreamAsync();
        //    return await new StreamReader(summarizedFileStream).ReadToEndAsync();
        //}

        /// <summary>
        /// Search by Keywords and Tags with Paging
        /// </summary>
        /// <param name="pageNumber">Page Number</param>
        /// <param name="pageSize">Page Size (Item Numbers per Page)</param>
        /// <param name="query">Search Keyword</param>
        /// <param name="tags">Tags</param>
        /// <returns></returns>
        public async Task<Model.UserInterface.DocumentQuerySet> GetDocumentsWithQuery(int pageNumber, 
                                                                                      int pageSize, 
                                                                                      string? query, 
                                                                                      Dictionary<string, string>? tags,
                                                                                      DateTime? searchStartDate,
                                                                                      DateTime? searchEndDate)
        {
            //Search from Memory then get the documents
            List<MemoryFilter> filters = new List<MemoryFilter>();

            if (tags != null && tags.Count > 0)
            {
                //The payload will be key and string values with comma separated
                //every values should be added to the filter with same key
                foreach (var kvp in tags)
                {
                    var values = kvp.Value.Split(',').Select(v => v.Trim()).ToArray();
                    foreach (var item in values)
                    {
                        filters.Add(new MemoryFilter().ByTag(kvp.Key, item));
                    }
                }
            }

            if ((string.IsNullOrEmpty(query) || query.Contains("*")) && filters.Count == 0)
            {
                return await this.GetDocuments(pageNumber, pageSize, searchStartDate, searchEndDate);
            }
            else
            {
                //when query string contains space, it should be add within [string] to avoiding separate search
                if(!string.IsNullOrEmpty(query) && query.Contains(" "))
                {
                    //make a double quote to avoid separate search
                    query = $"\"{query}\"";
                }

                if(!string.IsNullOrEmpty(query) && query.Contains("*"))
                {
                    query = null;
                }
                
                SearchResult result = await this._memoryWebClient.SearchAsync(query ?? String.Empty, filters: filters, minRelevance: 0.0166666676);

                //Get Document Ids from result
               var documentIds = result.Results.Select(r => r.DocumentId).ToArray();

                //Get Documents from Repository
                QueryResultSet resultSet = await _documentRepository.FindByDocumentIdsAsync(documentIds, pageNumber, pageSize);

                return new Model.UserInterface.DocumentQuerySet
                {
                    documents = resultSet.Results,
                    //keywordFilterInfo = GetConsolidatedKeywords(resultSet.Results),
                    //keywordFilterInfo = await GetConsolidatedKeywords(),
                    keywordFilterInfo = await _dataCache.GetConsolidatedKeywordsAsync(),
                    TotalPages = resultSet.TotalPages,
                    CurrentPage = resultSet.CurrentPage,
                    TotalRecords = resultSet.TotalRecords
                };
            }
        }

        public Dictionary<string, List<string>> GetConsolidatedKeywords(IEnumerable<Entities.Document> documents)
        {
            //var documents = await this.EntityCollection.GetAllAsync();
            var consolidatedKeywords = new Dictionary<string, List<string>>();

            foreach (var document in documents)
            {
                if (document.Keywords != null)
                {
                    foreach (var keywordDict in document.Keywords)
                    {
                        if (!consolidatedKeywords.ContainsKey(keywordDict.Key))
                        {
                            consolidatedKeywords[keywordDict.Key] = new List<string>();
                        }

                        //Before adding Value, check the value is already existing
                        //Split comma separated values and add to the list
                        var values = keywordDict.Value.Split(',').Select(v => v.Trim()).ToArray();

                        foreach (var value in values)
                        {
                            if (!consolidatedKeywords[keywordDict.Key].Contains(value))
                            {
                                consolidatedKeywords[keywordDict.Key].Add(value);
                            }

                            //set order values under same Key by asc.
                            consolidatedKeywords[keywordDict.Key] = consolidatedKeywords[keywordDict.Key].OrderBy(v => v).ToList();
                        }
                    }
                }
            }

            //set order key by asc
            consolidatedKeywords = consolidatedKeywords.OrderBy(k => k.Key).ToDictionary(k => k.Key, v => v.Value);
            return consolidatedKeywords;
        }

        

        public async Task<Dictionary<string, List<string>>> GetConsolidatedKeywords()
        {
            //var documents = await this.EntityCollection.GetAllAsync();
            var consolidatedKeywords = new Dictionary<string, List<string>>();

            //Get All Records only Keywords field.
            var documents = await _documentRepository.GetAllDocuments();

            foreach (var document in documents)
            {
                if (document.Keywords != null)
                {
                    foreach (var keywordDict in document.Keywords)
                    {
                        if (!consolidatedKeywords.ContainsKey(keywordDict.Key))
                        {
                            consolidatedKeywords[keywordDict.Key] = new List<string>();
                        }

                        //Before adding Value, check the value is already existing
                        //Split comma separated values and add to the list
                        var values = keywordDict.Value.Split(',').Select(v => v.Trim()).ToArray();

                        foreach (var value in values)
                        {
                            if (!consolidatedKeywords[keywordDict.Key].Contains(value))
                            {
                                consolidatedKeywords[keywordDict.Key].Add(value);
                            }

                            //set order values under same Key by asc.
                            consolidatedKeywords[keywordDict.Key] = consolidatedKeywords[keywordDict.Key].OrderBy(v => v).ToList();

                        }
                    }
                }
            }

            //set order key by asc
            consolidatedKeywords = consolidatedKeywords.OrderBy(k => k.Key).ToDictionary(k => k.Key, v => v.Value);
            return consolidatedKeywords;
        }
    }
}
