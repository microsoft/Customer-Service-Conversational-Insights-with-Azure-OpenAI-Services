// TODO
// Need to add error handling for any bad connections (SQL and Azure)
// Improved comments


using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace SearchIndexToSQL
{
    public class CopyIndexFunction
    {
        [FunctionName("CopyData")]
        public async Task RunTimer([TimerTrigger("0 */5 * * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log) // Every 5 minutes
        {

            log.LogInformation($"Timer trigger function executed at: {DateTime.Now}");

            try
            {
                // Configure Azure Search
                string accountName = "cscih4vqqu";
                string indexName = "conversational-index";
                string accountKey = "zB8AKZ7VCp0PkLXOJ2t9jOgtE8n3aZRphjtCBcBCbzAzSeBvuLbe";

                SearchClient client = new SearchClient(new Uri($"https://{accountName}.search.windows.net"), indexName,
                            new AzureKeyCredential(accountKey));

                // Configure SQL Database
                string SQLServer = "tcp:sqlserver20230927t012455z.database.windows.net,1433";
                string SQLDatabase = "Database-20230927t012455z";
                string SQLUser = "sqladmin";
                string SQLPassword = "sqlPASSWORD123";
                string connectionString = ($"Server={SQLServer};Initial Catalog={SQLDatabase};Persist Security Info=False;User ID={SQLUser};Password={SQLPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

                // Create connection to SQL Server
                using SqlConnection connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                // Confirm the target SQL table exists, else create it
                string sqlCreateTable = @"
                    IF NOT EXISTS(SELECT * from SYSOBJECTS WHERE Name = 'ConversationIndexData' and TYPE = 'U')
                    create table ConversationIndexData
                    (
                        ConversationId varchar(255),
                        StartTime DateTime null,
                        AgentName varchar(255),
                        MergedContent varchar(max),
                        Summary varchar(max),
                        Satisfied varchar(9),
                        Complaint varchar(max),
                        Compliment varchar(max),
                        OriginCity varchar(255),
                        DestinationCity varchar(255),
                        Hotel varchar(255),
                        Airline varchar(255)
                    )
                    ";
                using SqlCommand commandCreateTable = new SqlCommand(sqlCreateTable, connection);
                await commandCreateTable.ExecuteNonQueryAsync();


                //Query the Azure Search Index
                var results = (await client.SearchAsync<SearchDocument>("*"));
                var searchResults = results.Value.GetResultsAsync();
                string continuationToken = null;
                do
                {
                    await foreach (var item in searchResults.AsPages(continuationToken))
                    {
                        continuationToken = item.ContinuationToken;
                        var documents = item.Values;

                        // Copy data from Azure Search Index to SQL Database
                        foreach (var result in documents)
                        {
                            // Map Azure Search data to SQL table schema and create an INSERT statement
                            string sqlInsertQuery = "IF NOT EXISTS (SELECT * FROM ConversationIndexData WHERE ConversationId = @Value0) INSERT INTO ConversationIndexData (ConversationId, MergedContent, Summary, Complaint, OriginCity, DestinationCity, Hotel, Airline, StartTime, Compliment, AgentName, Satisfied) VALUES (@Value1, @Value2, @Value3, @Value4, @Value5, @Value6, @Value7, @Value8, @Value9, @Value10, @Value11, @Value12)";
                            using SqlCommand commandInsert = new SqlCommand(sqlInsertQuery, connection);

                            object ConversationId;
                            result.Document.TryGetValue("ConversationId", out ConversationId); ;
                            object MergedContent;
                            result.Document.TryGetValue("merged_content", out MergedContent); ;
                            object Summary;
                            result.Document.TryGetValue("summary", out Summary); ;
                            object Complaint;
                            result.Document.TryGetValue("Complaint", out Complaint);
                            object OriginCity;
                            result.Document.TryGetValue("OriginCity", out OriginCity);
                            object DestinationCity;
                            result.Document.TryGetValue("DestinationCity", out DestinationCity);
                            object Hotel;
                            result.Document.TryGetValue("Hotel", out Hotel); ;
                            object Airline;
                            result.Document.TryGetValue("Airline", out Airline);
                            object StartTime;
                            result.Document.TryGetValue("StartTime", out StartTime);
                            object Compliment;
                            result.Document.TryGetValue("Compliment", out Compliment);
                            object AgentName;
                            result.Document.TryGetValue("AgentName", out AgentName);
                            object Satisfied;
                            result.Document.TryGetValue("satisfied", out Satisfied);


                            commandInsert.Parameters.AddWithValue("@Value0", ConversationId);
                            commandInsert.Parameters.AddWithValue("@Value1", ConversationId);
                            commandInsert.Parameters.AddWithValue("@Value2", MergedContent);
                            commandInsert.Parameters.AddWithValue("@Value3", Summary);
                            commandInsert.Parameters.AddWithValue("@Value4", Complaint);
                            commandInsert.Parameters.AddWithValue("@Value5", OriginCity);
                            commandInsert.Parameters.AddWithValue("@Value6", DestinationCity);
                            commandInsert.Parameters.AddWithValue("@Value7", Hotel);
                            commandInsert.Parameters.AddWithValue("@Value8", Airline);
                            commandInsert.Parameters.AddWithValue("@Value9", StartTime);
                            commandInsert.Parameters.AddWithValue("@Value10", Compliment);
                            commandInsert.Parameters.AddWithValue("@Value11", AgentName);
                            commandInsert.Parameters.AddWithValue("@Value12", Satisfied);

                            await commandInsert.ExecuteNonQueryAsync();
                        }
                    }
                } while (continuationToken != null);

                log.LogInformation($"Timer trigger function finished at: {DateTime.Now}");
            }
            catch (Exception ex)
            {
                log.LogInformation($"Error copying data: {ex.Message}");
            }
        }
    }
}
