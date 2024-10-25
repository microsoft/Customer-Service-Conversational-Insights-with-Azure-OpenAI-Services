using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;

namespace Microsoft.GS.DPS.Storage.AISearch
{
    public class TagUpdater
    {
        private readonly SearchClient _searchClient;

        public TagUpdater(string searchEndPoint, string searchAPIKey, string indexName = "default")
        {
            _searchClient = new SearchClient(new Uri(searchEndPoint), indexName, new AzureKeyCredential(searchAPIKey));
        }

        public async Task UpdateTags(string documentId, List<string> updatingTags)
        {
            // Search for documents where the tags field contains the specified GUID
            var options = new SearchOptions
            {
                Filter = $"tags/any(t: t eq '__document_id:{documentId}')"
            };

            var searchResults = _searchClient.Search<SearchDocument>("*", options);

            await foreach (var result in searchResults.Value.GetResultsAsync())
            {
                var document = result.Document;
                var tags = document["tags"] as IEnumerable<object>;

                if (tags != null)
                {
                    var updatedTags = tags.Select(tag => tag.ToString()).ToList();
                    updatedTags.AddRange(updatingTags);

                    var updateDocument = new SearchDocument
                    {
                        ["id"] = document["id"],
                        ["tags"] = updatedTags
                    };

                    try
                    {
                        var response = await _searchClient.MergeOrUploadDocumentsAsync(new[] { updateDocument });
                        Console.WriteLine($"Document with ID {document["id"]} updated successfully. - {response.GetRawResponse().ToString()}");
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Error updating document with ID {document["id"]}: {ex.Message}");
                    }
                }
            }
        }
    }
}