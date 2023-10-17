using Azure;
using System;
using System.Collections.Generic;

namespace CognitiveSearch.UI.Models
{
    public class AggregateInsightViewModel 
    {
        public string KeyInsight1 { get; set; }
        public string KeyInsight2 { get; set; }

        public List<string> TopInsights { get; set; }

        public AggregateInsightViewModel()
        {
            TopInsights = new List<string>();
        }
    }
}
