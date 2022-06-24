// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Azure;
using Azure.Core;
using Azure.Core.Pipeline;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.ApplicationInsights;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CognitiveSearch.UI
{
    public class DocumentSearchClient
    {
        private IConfiguration _configuration { get; set; }
        private readonly SearchIndexClient _searchIndexClient;
        private readonly SearchClient _searchClient;
        private string searchServiceName { get; set; }
        private string apiKey { get; set; }
        private string IndexName { get; set; }
        private string IndexerName { get; set; }

        private string QueryLanguage { get; set; }
        private string SemanticConfiguration { get; set; }

        private string idField { get; set; }

        // Client logs all searches in Application Insights
        private static TelemetryClient telemetryClient = new TelemetryClient();
        public string SearchId { get; set; }

        public SearchSchema Schema { get; set; }
        public SearchModel Model { get; set; }

        public string ErrorMessage { get; set; }

        private bool _isPathBase64Encoded { get; set; }

        // data source information. Currently supporting 3 data sources indexed by different indexers
        private static string[] s_containerAddresses = null;
        private static string[] s_tokens = null;

        // this should match the default value used in appsettings.json.  
        private static string defaultContainerUriValue = "https://{storage-account-name}.blob.core.windows.net/{container-name}";

        public string AudioContainer { get; set; }

        public DocumentSearchClient(IConfiguration configuration)
        {
            try
            {
                _configuration = configuration;
                searchServiceName = configuration.GetSection("SearchServiceName")?.Value;
                apiKey = configuration.GetSection("SearchApiKey")?.Value;
                IndexName = configuration.GetSection("SearchIndexName")?.Value;
                IndexerName = configuration.GetSection("SearchIndexerName")?.Value;
                QueryLanguage = configuration.GetSection("QueryLanguage")?.Value;
                SemanticConfiguration = configuration.GetSection("SemanticConfiguration")?.Value;
                idField = configuration.GetSection("KeyField")?.Value;
                telemetryClient.InstrumentationKey = configuration.GetSection("InstrumentationKey")?.Value;
                AudioContainer = configuration.GetSection("AudioContainer")?.Value;

                // Options used to get a search id for reporting
                SearchClientOptions clientOptions = new SearchClientOptions();
                clientOptions.AddPolicy(new SearchIdPipelinePolicy(), HttpPipelinePosition.PerCall);

                // Create an HTTP reference to the catalog index
                _searchIndexClient = new SearchIndexClient(new Uri($"https://{searchServiceName}.search.windows.net/"), new AzureKeyCredential(apiKey), options: clientOptions);
                _searchClient = _searchIndexClient.GetSearchClient(IndexName);

                Schema = new SearchSchema().AddFields(_searchIndexClient.GetIndex(IndexName).Value.Fields);
                Model = new SearchModel(Schema);

                _isPathBase64Encoded = (configuration.GetSection("IsPathBase64Encoded")?.Value == "True");

            }
            catch (Exception e)
            {
                // If you get an exception here, most likely you have not set your
                // credentials correctly in appsettings.json
                throw new ArgumentException(e.Message.ToString());
            }
        }

        public SearchResults<SearchDocument> Search(string searchText, SearchFacet[] searchFacets = null, string[] selectFilter = null, int currentPage = 1, string polygonString = null, string startDate = null, string endDate = null, SearchQueryType queryType = SearchQueryType.Semantic)
        {
            try
            {
                SearchOptions options = GenerateSearchOptions(searchFacets, selectFilter, currentPage, polygonString, startDate, endDate, queryType);

                //if (!string.IsNullOrEmpty(telemetryClient.InstrumentationKey))
                //{
                //    var s = GenerateSearchId(searchText, options);
                //    SearchId = s.Result;
                //}

                Response<SearchResults<SearchDocument>> response = _searchClient.Search<SearchDocument>(searchText, options);

                // logging the search id for app insights
                if (!string.IsNullOrEmpty(telemetryClient.InstrumentationKey))
                {
                    IEnumerable<string> headerValues;
                    string searchId = string.Empty;
                    if (response.GetRawResponse().Headers.TryGetValues("x-ms-azs-searchid", out headerValues))
                    {
                        searchId = headerValues.FirstOrDefault();
                    }

                    SearchId = searchId;
                }

                return response.Value;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public SearchOptions GenerateSearchOptions(SearchFacet[] searchFacets = null, string[] selectFilter = null, int currentPage = 1, string polygonString = null, string startDate = null, string endDate = null, SearchQueryType queryType = SearchQueryType.Full)
        {
            SearchOptions options = new SearchOptions()
            {
                SearchMode = SearchMode.Any,
                Size = 10,
                Skip = (currentPage - 1) * 10,
                IncludeTotalCount = true,
                QueryType = queryType,
                HighlightPreTag = "<b>",
                HighlightPostTag = "</b>"
            };

            if (queryType == SearchQueryType.Semantic)
            {
                options.QueryLanguage = QueryLanguage;
                options.QueryAnswer = "extractive";
                options.SemanticConfigurationName = SemanticConfiguration;
            }

            foreach (string s in selectFilter)
            {
                options.Select.Add(s);
            }

            var facets = Model.Facets.Select(f => f.Name).ToList();
            foreach (string f in facets)
            {
                options.Facets.Add(f);
            }

            foreach (string h in Model.SearchableFields)
            {
                options.HighlightFields.Add(h);
            }


            string filter = null;
            var filterStr = string.Empty;

            if (searchFacets != null)
            {
                foreach (var item in searchFacets)
                {
                    var facet = Model.Facets.Where(f => f.Name == item.Key).FirstOrDefault();

                    filterStr = string.Join(",", item.Value);

                    // Construct Collection(string) facet query
                    if (facet.Type == typeof(string[]))
                    {
                        if (string.IsNullOrEmpty(filter))
                            filter = $"{item.Key}/any(t: search.in(t, '{filterStr}', ','))";
                        else
                            filter += $" and {item.Key}/any(t: search.in(t, '{filterStr}', ','))";
                    }
                    // Construct string facet query
                    else if (facet.Type == typeof(string))
                    {
                        if (string.IsNullOrEmpty(filter))
                            filter = $"{item.Key} eq '{filterStr}'";
                        else
                            filter += $" and {item.Key} eq '{filterStr}'";
                    }
                    // Construct DateTime facet query
                    else if (facet.Type == typeof(DateTime))
                    {
                        // TODO: Date filters
                    }
                }
            }

            if (!string.IsNullOrEmpty(startDate))
            {
                if (string.IsNullOrEmpty(filter))
                    filter = $"StartTime ge {startDate}T00:00:00.000Z";
                else
                    filter += $" and StartTime ge {startDate}T00:00:00.000Z";
            }

            if (!string.IsNullOrEmpty(endDate))
            {
                if (string.IsNullOrEmpty(filter))
                    filter = $"StartTime le {endDate}T00:00:00.000Z";
                else
                    filter += $" and StartTime le {endDate}T00:00:00.000Z";
            }

            options.Filter = filter;

            // Add Filter based on geographic polygon if it is set.
            if (polygonString != null && polygonString.Length > 0)
            {
                string geoQuery = "geo.intersects(geoLocation, geography'POLYGON((" + polygonString + "))')";

                if (options.Filter != null && options.Filter.Length > 0)
                {
                    options.Filter += " and " + geoQuery;
                }
                else
                {
                    options.Filter = geoQuery;
                }
            }

            return options;
        }

        public SuggestResults<SearchDocument> Suggest(string searchText, bool fuzzy)
        {
            // Execute search based on query string
            try
            {
                SuggestOptions options = new SuggestOptions()
                {
                    UseFuzzyMatching = fuzzy,
                    Size = 8
                };

                return _searchClient.Suggest<SearchDocument>(searchText, "sg", options);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public AutocompleteResults Autocomplete(string searchText, bool fuzzy)
        {
            // Execute search based on query string
            try
            {
                AutocompleteOptions options = new AutocompleteOptions()
                {
                    Mode = AutocompleteMode.OneTermWithContext,
                    UseFuzzyMatching = fuzzy,
                    Size = 8
                };

                return _searchClient.Autocomplete(searchText, "sg", options);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }


        public SearchDocument LookUp(string id)
        {
            // Execute geo search based on query string
            try
            {
                return _searchClient.GetDocument<SearchDocument>(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }


        private async Task<string> GenerateSearchId(string searchText, SearchOptions options)
        {
            //var client = new SearchClient(new Uri($"https://{searchServiceName}.search.windows.net/"), IndexName, new AzureKeyCredential(apiKey));
            var response = await _searchClient.SearchAsync<SearchDocument>(searchText: searchText, options);
            IEnumerable<string> headerValues;
            string searchId = string.Empty;
            if (response.GetRawResponse().Headers.TryGetValues("x-ms-azs-searchid", out headerValues))
            {
                searchId = headerValues.FirstOrDefault();
            }
            return searchId;
        }

        public string GetSearchId()
        {
            if (SearchId != null) { return SearchId; }
            return string.Empty;
        }

        public SearchResults<SearchDocument> GetFacets(string searchText, List<string> facetNames, int maxCount = 30)
        {
            var facets = new List<String>();

            foreach (var facet in facetNames)
            {
                facets.Add($"{facet}, count:{maxCount}");
            }

            // Execute search based on query string
            try
            {
                SearchOptions options = new SearchOptions()
                {
                    SearchMode = SearchMode.Any,
                    Size = 10,
                    QueryType = SearchQueryType.Full
                };

                foreach (string s in facetNames)
                {
                    options.Facets.Add(s);
                }

                return _searchIndexClient.GetSearchClient(IndexName).Search<SearchDocument>(searchText, options);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public DocumentResult GetDocuments(string q, SearchFacet[] searchFacets, int currentPage, string polygonString = null, string startDate = null, string endDate = null, SearchQueryType queryType = SearchQueryType.Full)
        {
            GetContainerSasUris();

            var selectFilter = Model.SelectFilter;

            //if (!string.IsNullOrEmpty(q))
            //{
            //    q = q.Replace("?", "");
            //}

            var response = Search(q, searchFacets, selectFilter, currentPage, polygonString, startDate, endDate, queryType);
            var searchId = GetSearchId().ToString();
            var facetResults = new List<Facet>();
            var tagsResults = new List<object>();

            if (response != null && response.Facets != null)
            {
                // Return only the selected facets from the Search Model
                foreach (var facetResult in response.Facets.Where(f => Model.Facets.Where(x => x.Name == f.Key).Any()))
                {
                    var cleanValues = GetCleanFacetValues(facetResult);

                    facetResults.Add(new Facet
                    {
                        key = facetResult.Key,
                        value = cleanValues
                    });
                }

                foreach (var tagResult in response.Facets.Where(t => Model.Tags.Where(x => x.Name == t.Key).Any()))
                {
                    var cleanValues = GetCleanFacetValues(tagResult);

                    tagsResults.Add(new
                    {
                        key = tagResult.Key,
                        value = cleanValues
                    });
                }
            }

            var result = new DocumentResult
            {
                Results = (response == null ? null : response.GetResults()),
                Facets = facetResults,
                Tags = tagsResults,
                Count = (response == null ? 0 : Convert.ToInt32(response.TotalCount)),
                SearchId = searchId,
                IdField = idField,
                Token = s_tokens[0],
                IsPathBase64Encoded = _isPathBase64Encoded,
                Answer = response.Answers != null && response.Answers.Count() > 0 ? response.Answers[0].Highlights : null,
                Captions = new List<Caption>()
            };

            string json = JsonConvert.SerializeObject(facetResults);

            foreach (var x in result.Results)
            { // response.GetResults() 
                if (x.Captions != null)
                {
                    Caption c = new Caption();
                    c.metadata_storage_name = x.Document.GetString("metadata_storage_name");
                    c.text = x.Captions[0]?.Text;

                    result.Captions.Add(c);
                }
            }

            return result;
        }

        /// <summary>
        /// Initiates a run of the search indexer.
        /// </summary>
        public async Task RunIndexer()
        {
            SearchIndexerClient _searchIndexerClient = new SearchIndexerClient(new Uri($"https://{searchServiceName}.search.windows.net/"), new AzureKeyCredential(apiKey));
            var indexStatus = await _searchIndexerClient.GetIndexerStatusAsync(IndexerName);
            if (indexStatus.Value.LastResult.Status != IndexerExecutionStatus.InProgress)
            {
                _searchIndexerClient.RunIndexer(IndexerName);
            }
        }

        private string GetToken(string decodedPath, out int storageIndex)
        {
            // Initialize s_tokens and containers if not already initialized
            GetContainerSasUris();

            // Determine which token to use.
            string tokenToUse;
            if (decodedPath.ToLower().Contains(s_containerAddresses[1])) { tokenToUse = s_tokens[1]; storageIndex = 1; }
            else if (decodedPath.ToLower().Contains(s_containerAddresses[2])) { tokenToUse = s_tokens[2]; storageIndex = 2; }
            else { tokenToUse = s_tokens[0]; storageIndex = 0; }

            return tokenToUse;
        }

        /// <summary>
        /// This will return up to 3 s_tokens for the storage accounts
        /// </summary>
        /// <returns></returns>
        private void GetContainerSasUris()
        {
            // We need to refresh the s_tokens every time or they will become invalid.
            s_tokens = new string[3];
            s_containerAddresses = new string[3];

            string accountName = _configuration.GetSection("StorageAccountName")?.Value;
            string accountKey = _configuration.GetSection("StorageAccountKey")?.Value;
            StorageSharedKeyCredential storageSharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            s_containerAddresses[0] = _configuration.GetSection("StorageContainerAddress")?.Value.ToLower();
            s_containerAddresses[1] = _configuration.GetSection("StorageContainerAddress2")?.Value.ToLower();
            s_containerAddresses[2] = _configuration.GetSection("StorageContainerAddress3")?.Value.ToLower();
            int s_containerAddressesLength = s_containerAddresses.Length;
            if (String.Equals(s_containerAddresses[1], defaultContainerUriValue))
            {
                s_containerAddressesLength--;
            }
            if (String.Equals(s_containerAddresses[2], defaultContainerUriValue))
            {
                s_containerAddressesLength--;
            }
            for (int i = 0; i < s_containerAddressesLength; i++)
            {
                BlobContainerClient container = new BlobContainerClient(new Uri(s_containerAddresses[i]), new StorageSharedKeyCredential(accountName, accountKey));
                var policy = new BlobSasBuilder
                {
                    Protocol = SasProtocol.HttpsAndHttp,
                    BlobContainerName = container.Name,
                    Resource = "c",
                    StartsOn = DateTimeOffset.UtcNow,
                    ExpiresOn = DateTimeOffset.UtcNow.AddHours(24),
                    IPRange = new SasIPRange(IPAddress.None, IPAddress.None)
                };
                policy.SetPermissions(BlobSasPermissions.Read);
                var sas = policy.ToSasQueryParameters(storageSharedKeyCredential);
                BlobUriBuilder sasUri = new BlobUriBuilder(container.Uri);
                sasUri.Sas = sas;

                s_tokens[i] = "?" + sasUri.Sas.ToString();


            }
        }

        public DocumentResult GetDocumentById(string id)
        {
            var decodedPath = id;

            var response = LookUp(id);

            if (_isPathBase64Encoded)
            {
                decodedPath = Base64Decode(id);
            }

            int storageIndex;
            string tokenToUse = GetToken(decodedPath, out storageIndex);

            if (AudioContainer != "" && AudioContainer != null)
            {
                Uri blobUri = new Uri(decodedPath);
                if (blobUri.AbsolutePath.Contains(".mp3") || blobUri.AbsolutePath.Contains(".wav") || blobUri.AbsolutePath.Contains(".m4a"))
                {
                    string audioPath = AudioContainer + "/" + String.Join("", blobUri.Segments[2..]);
                    audioPath = blobUri.Scheme + "://" + blobUri.Host + "/" + audioPath.Replace(".json", "");
                    string audioToken = GetToken(audioPath, out int x);
                    response.Add("audioPath", audioPath + audioToken);
                }
                else
                {
                    response.Add("audioPath", null);
                }

            }

            var result = new DocumentResult
            {
                Result = response,
                Token = tokenToUse,
                StorageIndex = storageIndex,
                DecodedPath = decodedPath,
                IdField = idField,
                IsPathBase64Encoded = _isPathBase64Encoded
            };
            return result;
        }

        private static string Base64Decode(string input)
        {
            if (input == null) throw new ArgumentNullException("input");
            int inputLength = input.Length;
            if (inputLength < 1) return null;

            // Get padding chars
            int numPadChars = (int)input[inputLength - 1] - (int)'0';
            if (numPadChars < 0 || numPadChars > 10)
            {
                return null;
            }

            // replace '-' and '_'
            char[] base64Chars = new char[inputLength - 1 + numPadChars];
            for (int iter = 0; iter < inputLength - 1; iter++)
            {
                char c = input[iter];

                switch (c)
                {
                    case '-':
                        base64Chars[iter] = '+';
                        break;

                    case '_':
                        base64Chars[iter] = '/';
                        break;

                    default:
                        base64Chars[iter] = c;
                        break;
                }
            }

            // Add padding chars
            for (int iter = inputLength - 1; iter < base64Chars.Length; iter++)
            {
                base64Chars[iter] = '=';
            }

            var charArray = Convert.FromBase64CharArray(base64Chars, 0, base64Chars.Length);
            return System.Text.Encoding.Default.GetString(charArray);
        }

        /// <summary>
        /// In some situations you may want to restrict the facets that are displayed in the
        /// UI. This allows you to add some heuristics to remove facets that you may consider unnecessary.
        /// </summary>
        /// <param name="facetResult"></param>
        /// <returns></returns>
        private static List<FacetValue> GetCleanFacetValues(KeyValuePair<string, IList<FacetResult>> facetResult)
        {
            List<FacetValue> cleanValues = new List<FacetValue>();

            if (facetResult.Key == "people")
            {
                // only add names that are long enough 
                foreach (var element in facetResult.Value)
                {
                    if (element.Values.ToString().Length >= 4)
                    {

                        cleanValues.Add(new FacetValue() { value = element.Value.ToString(), count = element.Count });
                    }
                }

                return cleanValues;
            }
            else
            {
                List<FacetValue> outputFacets = facetResult.Value
                           .Select(x => new FacetValue() { value = x.Value.ToString(), count = x.Count })
                           .ToList();
                return outputFacets;
            }
        }
    }
    public class SearchIdPipelinePolicy : HttpPipelineSynchronousPolicy
    {
        public override void OnSendingRequest(HttpMessage message)
        {
            message.Request.Headers.SetValue("x-ms-azs-return-searchid", "true");
        }
    }
}