using Azure;
using Azure.Data.Tables;
using System;

namespace CognitiveSearch.UI.Models
{
    public class AvgCloseRateTableViewModel : ITableEntity
    {

        //create me a model with the following properties
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }

        public DateTimeOffset? Timestamp { get; set; }

        public string AllRegions { get; set; }

        public string TopRegions { get; set; }

        public string SatisfactionTrend1 { get; set; }

        public string SatisfactionTrend2 { get; set; }

        public string SatisfactionTrend3 { get; set; }

        public string SatisfactionTrend4 { get; set; }

        public string SatisfactionTrend5 { get; set; }

        public ETag ETag { get; set; }


    }
}
