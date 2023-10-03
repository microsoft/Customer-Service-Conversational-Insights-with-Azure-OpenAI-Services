using Azure.Data.Tables;
using CognitiveSearch.UI.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;

namespace CognitiveSearch.UI
{
    public class TableService
    {
        private readonly TableServiceClient service;
        private IConfiguration _configuration { get; set; }

        private string accountName { get; set; }

        private string storageAccountKey { get; set; }

        private string storageUri { get; set; }

        public TableService(IConfiguration configuration)
        {
            try
            {
                _configuration = configuration;
                accountName = configuration.GetSection("StorageAccountName")?.Value;
                storageAccountKey = configuration.GetSection("TableStorageAccountKey")?.Value;
                storageUri = configuration.GetSection("TableStorageUri")?.Value;

                Uri uri = new Uri(storageUri);
                TableSharedKeyCredential credential = new TableSharedKeyCredential(accountName, storageAccountKey);
                service = new TableServiceClient(uri, credential);

            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message.ToString());
            }
        }
        
        public CustomerSatisfactionTableViewModel GetSatisfactionTableData(string tableName, string PartitionKey, string RowKey)
        {
            var tableClient = service.GetTableClient(tableName);
            var tableResponse = tableClient.GetEntity<CustomerSatisfactionTableViewModel>(PartitionKey, RowKey);
            var tableString = tableResponse.GetRawResponse();
            var tableResult = JsonConvert.DeserializeObject<CustomerSatisfactionTableViewModel>(tableString.Content.ToString());

            return tableResult;

        }

        public AvgCloseRateTableViewModel GetAvgCloseRateTableData(string tableName, string PartitionKey, string RowKey)
        {
            var tableClient = service.GetTableClient(tableName);
            var tableResponse = tableClient.GetEntity<AvgCloseRateTableViewModel>(PartitionKey, RowKey);
            var tableString = tableResponse.GetRawResponse();
            var tableResult = JsonConvert.DeserializeObject<AvgCloseRateTableViewModel>(tableString.Content.ToString());

            return tableResult;

        }

    }
}
