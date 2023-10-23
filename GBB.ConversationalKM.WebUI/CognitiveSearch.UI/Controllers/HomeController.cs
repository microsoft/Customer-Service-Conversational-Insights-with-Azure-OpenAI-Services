// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using CognitiveSearch.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;

namespace CognitiveSearch.UI.Controllers
{
    public class HomeController : Controller
    {
        private IConfiguration _configuration { get; set; }
        private DocumentSearchClient _docSearch { get; set; }

        private string _configurationError { get; set; }

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
            InitializeDocSearch();
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

        private bool StringHasValue(string value)
        {
            var noValueMatches = new string[] { "n/a", "none", "", "not mentioned", "unknown", "no complaint", "no compliment" };
            return !noValueMatches.Contains(value.ToLower());
        }
        public AggregateInsightViewModel GetCustomerSatisfactionInsights(DocumentResult documentResult)
        {
            var viewModel = new AggregateInsightViewModel();
            var satisfiedCount = 0.0;
            var unsatisfiedCount = 0.0;
            var totalCount = 0.0;

            // get satisfied values to determine percentage
            try
            {
                // set the number of satisfied customers
                var satisfied = documentResult.Facets
                        .Where(x => x.key.ToLower() == "satisfied")
                        .SelectMany(x => x.value)
                        .Where(x => x.value.ToLower() == "yes")
                        .Select(x=>x.count)
                        .FirstOrDefault();

                // calculate percentage by using total count from search
                satisfiedCount = (double)satisfied.Value;
               
            } catch(Exception ex)
            {
                viewModel.KeyInsight1 = "n/a";
            }

            // get unsatisfied values to determine percentage
            try
            {
                // set the number of unsatisfied customers
                var unsatisfied = documentResult.Facets
                        .Where(x => x.key.ToLower() == "satisfied")
                        .SelectMany(x => x.value)
                        .Where(x => x.value.ToLower() != "yes")// double check with design on if just not "no" or just "no"
                        .Select(x => x.count)
                        .FirstOrDefault();

                // calculate percentage by using total count from search

                unsatisfiedCount = (double)unsatisfied.Value;

            }
            catch (Exception ex)
            {
                viewModel.KeyInsight2 = "n/a";
            }

            // calculate percentages and set values to display
            if (satisfiedCount + unsatisfiedCount > 0)
            {
                totalCount = satisfiedCount + unsatisfiedCount;

                viewModel.KeyInsight1 = Math.Round(satisfiedCount / totalCount * 100, 1) + "%";
                viewModel.KeyInsight2 = Math.Round(unsatisfiedCount / totalCount * 100, 1) + "%";
            }

            // set the top complaints from the search
            try
            {
                viewModel.TopInsights = documentResult.Facets
                    .Where(x => x.key.ToLower() == "complaint")
                    .SelectMany(x => x.value)
                    .Where(x => StringHasValue(x.value))
                    .OrderByDescending(x => x.count)
                    .Select(x => x.value)
                    .Take(5)
                    .ToList();

            }
            catch (Exception e)
            {
                viewModel.TopInsights.Add("n/a");
            }


            return viewModel;
        }

        public AggregateInsightViewModel GetCityInsights(DocumentResult documentResult)
        {
            var viewModel = new AggregateInsightViewModel();

            // set the top origin city based on facet count
            try
            {
                viewModel.KeyInsight1 = documentResult.Facets
                    .Where(x => x.key.ToLower() == "origincity")
                    .SelectMany(x => x.value)
                    .Where(x => StringHasValue(x.value))
                    .OrderByDescending(x => x.count)
                    .Select(x => x.value)
                    .Take(1)
                    .FirstOrDefault();
            }
            catch (Exception ex) {
                viewModel.KeyInsight1 = "n/a"; 
            }

            // set the top destination city based on facet count
            try
            {
                viewModel.KeyInsight2 = documentResult.Facets
                    .Where(x => x.key.ToLower() == "destinationcity")
                    .SelectMany(x => x.value)
                    .Where(x => StringHasValue(x.value))
                    .OrderByDescending(x => x.count)
                    .Select(x => x.value)
                    .Take(1)
                    .FirstOrDefault();
            }
            catch (Exception ex)
            {
                viewModel.KeyInsight2 = "n/a";
            }

            // set the top hotels from compliments from the search
            try
            {
                viewModel.TopInsights = documentResult.Facets
                    .Where(x => x.key.ToLower() == "hotel")
                    .SelectMany(x => x.value)
                    .Where(x => StringHasValue(x.value))
                    .OrderByDescending(x => x.count)
                    .Select(x => x.value)
                    .Take(5)
                    .ToList();

            }
            catch (Exception e) {
                viewModel.TopInsights.Add("n/a");
            }

            return viewModel;
        }
        
        public IActionResult Index()
        {
            CheckDocSearchInitialized();

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

            // build aggregate insights
            var documentResult = _docSearch.GetDocuments(searchParams.q, searchParams.searchFacets, searchParams.currentPage, searchParams.polygonString, searchParams.startDate, searchParams.endDate, searchParams.queryType);
            
            
            var viewModel = new SearchResultViewModel
            {
                documentResult = documentResult,
                query = searchParams.q,
                selectedFacets = searchParams.searchFacets,
                currentPage = searchParams.currentPage,
                searchId = searchidId ?? null,
                applicationInstrumentationKey = _configuration.GetSection("InstrumentationKey")?.Value,
                searchServiceName = _configuration.GetSection("SearchServiceName")?.Value,
                indexName = _configuration.GetSection("SearchIndexName")?.Value,
                facetableFields = _docSearch.Model.Facets.Select(k => k.Name).ToArray(),
                answer = "",
                semanticEnabled = !String.IsNullOrEmpty(_configuration.GetSection("SemanticConfiguration")?.Value),
                Insight1 = GetCustomerSatisfactionInsights(documentResult),
                Insight2 = GetCityInsights(documentResult)
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