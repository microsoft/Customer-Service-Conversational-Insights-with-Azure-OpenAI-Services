using Azure;
using Azure.Data.Tables;
using System;

namespace CognitiveSearch.UI.Models
{
    public class CustomerSatisfactionTableViewModel : ITableEntity
    {

        //create me a model with the following properties
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }

        public DateTimeOffset? Timestamp { get; set; }

        public Int32 SatisfiedCustomers { get; set; }

        public Int32 UnSatisfiedCustomers { get; set; }

        public string Complaint1 { get; set; }

        public string Complaint2 { get; set; }

        public string Complaint3 { get; set; }

        public string Complaint4 { get; set; }

        public string Complaint5 { get; set; }

        public ETag ETag { get; set; }


    }
}
