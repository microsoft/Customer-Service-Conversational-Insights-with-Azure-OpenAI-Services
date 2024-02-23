using Azure;
using System;
using System.Collections.Generic;

namespace CognitiveSearch.UI.Models
{
    public class AggregateInsightViewModel 
    {
        public string KeyInsight1 { get; set; }
        public string KeyInsight1Label { get; set; }
        public string KeyInsight2 { get; set; }
        public string KeyInsight2Label { get; set; }

        public string Insights2Title { get; set; }

        public List<string> TopInsights { get; set; }
        public string TopInsightsLabel { get; set; }

        public AggregateInsightViewModel()
        {
            TopInsights = new List<string>();
        }
    }
}
