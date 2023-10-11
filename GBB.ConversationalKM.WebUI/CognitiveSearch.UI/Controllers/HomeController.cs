// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Azure.Data.Tables;
using Azure.Search.Documents.Models;
using CognitiveSearch.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace CognitiveSearch.UI.Controllers
{
    public class HomeController : Controller
    {
        private TableServiceClient serviceClient;

        private IConfiguration _configuration { get; set; }
        private DocumentSearchClient _docSearch { get; set; }

        private TableService _tableService { get; set; }
        private string _configurationError { get; set; }

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
            InitializeDocSearch();
            //InitializeTableService();
        }

        private void InitializeDocSearch()
        {
            try
            {
                _docSearch = new DocumentSearchClient(_configuration);
            }
            catch (Exception e)
            {
                _configurationError = $"The application settings are possibly incorrect. The server responded with this message: " + e.Message.ToString();
            }
        }

        public bool CheckDocSearchInitialized()
        {
            if (_docSearch == null)
            {
                ViewBag.Style = "alert-warning";
                ViewBag.Message = _configurationError;
                return false;
            }

            return true;
        }

        public IActionResult Index()
        {
            CheckDocSearchInitialized();
            //CheckTableServiceInitialized();

            var viewModel = SearchView(new SearchOptions
            {
                q = "",
                // initialize searchFacets to empty array to avoid null reference errors
                searchFacets = new SearchFacet[0],
                currentPage = 1,
                queryType = SearchQueryType.Full
            });

            return View("Search", viewModel);
        }

        private void InitializeTableService()
        {
            try
            {
                _tableService = new TableService(_configuration);
            }
            catch (Exception e)
            {
                _configurationError = $"The application settings are possibly incorrect. The server responded with this message: " + e.Message.ToString();
            }
        }

        public bool CheckTableServiceInitialized()
        {
            if (_tableService == null)
            {
                ViewBag.Style = "alert-warning";
                ViewBag.Message = _configurationError;
                return false;
            }

            return true;
        }

        public CustomerSatisfactionTableViewModel CustomerSatisfactionTable()
        {

            var tableResult = _tableService.GetSatisfactionTableData("customersatisfactiontable", "1", "1");
            var viewModel = new CustomerSatisfactionTableViewModel
            {
                RowKey = tableResult.RowKey,
                PartitionKey = tableResult.PartitionKey,
                SatisfiedCustomers = tableResult.SatisfiedCustomers,
                UnSatisfiedCustomers = tableResult.UnSatisfiedCustomers,
                Complaint1 = tableResult.Complaint1,
                Complaint2 = tableResult.Complaint2,
                Complaint3 = tableResult.Complaint3,
                Complaint4 = tableResult.Complaint4,
                Complaint5 = tableResult.Complaint5
            };

            return viewModel;
        }

        public AvgCloseRateTableViewModel AvgCloseRateTable()
        {

            var tableRes = _tableService.GetAvgCloseRateTableData("avgcloseratetable", "1", "1");
            var viewModel = new AvgCloseRateTableViewModel
            {
                RowKey = tableRes.RowKey,
                PartitionKey = tableRes.PartitionKey,
                AllRegions = tableRes.AllRegions,
                TopRegions = tableRes.TopRegions,
                SatisfactionTrend1 = tableRes.SatisfactionTrend1,
                SatisfactionTrend2 = tableRes.SatisfactionTrend2,
                SatisfactionTrend3 = tableRes.SatisfactionTrend3,
                SatisfactionTrend4 = tableRes.SatisfactionTrend4,
                SatisfactionTrend5 = tableRes.SatisfactionTrend5
            };
            return viewModel;
        }


        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

        }

        public IActionResult Search([FromQuery]string q = "", [FromQuery]string facets = "", [FromQuery]int page = 1, [FromQuery]string queryType = "Full")
        {
            // Split the facets.
            //  Expected format: &facets=key1_val1,key1_val2,key2_val1
            var searchFacets = facets
                // Split by individual keys
                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                // Split key/values
                .Select(f => f.Split("_", StringSplitOptions.RemoveEmptyEntries))
                // Group by keys
                .GroupBy(f => f[0])
                // Select grouped key/values into SearchFacet array
                .Select(g => new SearchFacet { Key = g.Key, Value = g.Select(f => f[1]).ToArray() })
                .ToArray();

            // Set queryType
            SearchQueryType searchQueryType = SearchQueryType.Full;
            if (queryType == "Semantic")
            {
                searchQueryType = SearchQueryType.Semantic;
            }

            var viewModel = SearchView(new SearchOptions
            {
                q = q,
                searchFacets = searchFacets,
                currentPage = page,
                queryType = searchQueryType
            });

            return View(viewModel);
        }

        public class SearchOptions
        {
            public string q { get; set; }
            public SearchFacet[] searchFacets { get; set; }
            public int currentPage { get; set; }
            public string polygonString { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public SearchQueryType queryType { get; set; }
        }

        [HttpPost]
        public SearchResultViewModel SearchView([FromForm] SearchOptions searchParams)
        {
            if (searchParams.q == null)
                searchParams.q = "";
            if (searchParams.searchFacets == null)
                searchParams.searchFacets = new SearchFacet[0];
            if (searchParams.currentPage == 0)
                searchParams.currentPage = 1;

            string searchidId = null;

            if (CheckDocSearchInitialized())
                searchidId = _docSearch.GetSearchId().ToString();

            var viewModel = new SearchResultViewModel
            {
                documentResult = _docSearch.GetDocuments(searchParams.q, searchParams.searchFacets, searchParams.currentPage, searchParams.polygonString, searchParams.startDate, searchParams.endDate, searchParams.queryType),
                query = searchParams.q,
                selectedFacets = searchParams.searchFacets,
                currentPage = searchParams.currentPage,
                searchId = searchidId ?? null,
                applicationInstrumentationKey = _configuration.GetSection("InstrumentationKey")?.Value,
                searchServiceName = _configuration.GetSection("SearchServiceName")?.Value,
                indexName = _configuration.GetSection("SearchIndexName")?.Value,
                facetableFields = _docSearch.Model.Facets.Select(k => k.Name).ToArray(),
                answer = "",
                semanticEnabled = !String.IsNullOrEmpty(_configuration.GetSection("SemanticConfiguration")?.Value)
                //customerSatisfactionTableResult = CustomerSatisfactionTable(),
                //avgCloseRateTableResult = AvgCloseRateTable()
            };
            viewModel.answer = viewModel.documentResult.Answer;
            viewModel.captions = viewModel.documentResult.Captions;
            return viewModel;
        }

        [HttpPost]
        public IActionResult GetDocumentById(string id = "")
        {
            var result = _docSearch.GetDocumentById(id);

            return new JsonResult(result);
        }

        public class MapCredentials
        {
            public string MapKey { get; set; }
        }


        [HttpPost]
        public IActionResult GetMapCredentials()
        {
            string mapKey = _configuration.GetSection("AzureMapsSubscriptionKey")?.Value;

            return new JsonResult(
                new MapCredentials
                {
                    MapKey = mapKey
                });
        }

        [HttpPost]
        public ActionResult GetGraphData(string query, string[] fields, int maxLevels, int maxNodes)
        {
            string[] facetNames = fields;

            if (facetNames == null || facetNames.Length == 0)
            {
                string facetsList = _configuration.GetSection("GraphFacet")?.Value;

                facetNames = facetsList.Split(new char[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            }

            if (query == null)
            {
                query = "*";
            }

            FacetGraphGenerator graphGenerator = new FacetGraphGenerator(_docSearch);
            var graphJson = graphGenerator.GetFacetGraphNodes(query, facetNames.ToList<string>(), maxLevels, maxNodes);

            return Content(graphJson.ToString(), "application/json");
        }

        [HttpPost, HttpGet]
        public ActionResult Suggest(string term, bool fuzzy = true)
        {
            // Change to _docSearch.Suggest if you would prefer to have suggestions instead of auto-completion
            var response = _docSearch.Autocomplete(term, fuzzy);

            List<string> suggestions = new List<string>();
            if (response != null)
            {
                foreach (var result in response.Results)
                {
                    suggestions.Add(result.Text);
                }
            }

            // Get unique items
            List<string> uniqueItems = suggestions.Distinct().ToList();

            return new JsonResult
            (
                uniqueItems
            );

        }
    }
}