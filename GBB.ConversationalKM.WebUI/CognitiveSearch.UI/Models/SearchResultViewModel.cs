using System.Collections.Generic;

namespace CognitiveSearch.UI.Models
{
    public class SearchResultViewModel
    {
        public DocumentResult documentResult { get; set; }

        public string query { get; set; }

        public SearchFacet[] selectedFacets { get; set; }

        public int currentPage { get; set; }

        public string searchId { get; set; }

        public string applicationInstrumentationKey { get; set; }
        public string searchServiceName { get; set; }
        public string indexName { get; set; }

        public string[] facetableFields { get; set; }

        public string answer { get; set; }

        public List<Caption> captions { get; set; }

        public string queryType { get; set; }

        public bool semanticEnabled { get; set; }

        public AggregateInsightViewModel Insight1 { get; set; }

        public AggregateInsightViewModel Insight2 { get; set; }
    }
}