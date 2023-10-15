using CognitiveSearch.UI.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace CognitiveSearch.UI
{
    public class DbService
    {
        private IConfiguration _configuration { get; set; }

        private string sqlServer { get; set; }
        private string sqlDatabase { get; set; }
        private string sqlUser { get; set; }
        private string sqlPassword { get; set; }

        private string connectionString { get { return $"Data Source={sqlServer};Initial Catalog={sqlDatabase};Persist Security Info=False;User ID={sqlUser};Password={sqlPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"; } }

        public DbService(IConfiguration configuration)
        {
            try
            {
                _configuration = configuration;

                sqlServer = _configuration.GetSection("SqlServer")?.Value;
                sqlDatabase = _configuration.GetSection("SqlDatabase")?.Value;
                sqlUser = _configuration.GetSection("SqlUser")?.Value;
                sqlPassword = _configuration.GetSection("SqlPassword")?.Value;





            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message.ToString());
            }
        }

        public AggregateInsightViewModel GetSatisfactionInsights(int numberOfTopInsights)
        {
            var viewModel = new AggregateInsightViewModel();

            // query for top percentages
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmdKey = new SqlCommand("SELECT COUNT(*) AS TotalCount, SUM(CASE WHEN Satisfied = 'yes' THEN 1 ELSE 0 END) AS Satisfied, SUM(CASE WHEN Satisfied = 'no' THEN 1 ELSE 0 END) AS Unsatisfied FROM ConversationIndexData", conn);
                var keyInsightReader = cmdKey.ExecuteReader();

                while (keyInsightReader.Read())
                {
                    var totalCount = Convert.ToDouble(keyInsightReader["TotalCount"]);
                    var satisfied = Convert.ToDouble(keyInsightReader["Satisfied"]);
                    var unsatisfied = Convert.ToDouble(keyInsightReader["Unsatisfied"]);

                    viewModel.KeyInsightPercent1 = satisfied / totalCount * 100;
                    viewModel.KeyInsightPercent2 = unsatisfied / totalCount * 100;
                }
            }

            // query for the top compliments
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmdTop = new SqlCommand("SELECT TOP (@returnCount) Complaint, 'TotalCount'=count(*) FROM ConversationIndexData WHERE complaint NOT IN ('','None','N/A','No complaint') GROUP BY Complaint ORDER BY count(*) DESC", conn);
                cmdTop.Parameters.AddWithValue("@returnCount", numberOfTopInsights);
                var topInsightReader = cmdTop.ExecuteReader();

                while (topInsightReader.Read())
                {
                    viewModel.TopInsights.Add(topInsightReader[0].ToString());
                    if (viewModel.TopInsights.Count == numberOfTopInsights) break;
                }
            }

            return viewModel;
        }

        public AggregateInsightViewModel GetAvgCloseRateInsights(int numberOfTopInsights)
        {
            var viewModel = new AggregateInsightViewModel();

            // query for top percentages
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmdKey = new SqlCommand("SELECT COUNT(*) AS TotalCount, SUM(CASE WHEN Satisfied = 'yes' THEN 1 ELSE 0 END) AS Satisfied, SUM(CASE WHEN Satisfied = 'no' THEN 1 ELSE 0 END) AS Unsatisfied FROM ConversationIndexData", conn);
                var keyInsightReader = cmdKey.ExecuteReader();

                while (keyInsightReader.Read())
                {
                    var totalCount = Convert.ToDouble(keyInsightReader["TotalCount"]);
                    var satisfied = Convert.ToDouble(keyInsightReader["Satisfied"]);
                    var unsatisfied = Convert.ToDouble(keyInsightReader["Unsatisfied"]);

                    viewModel.KeyInsightPercent1 = 0; // satisfied / totalCount * 100;
                    viewModel.KeyInsightPercent2 = 0; // unsatisfied / totalCount * 100;
                }
            }

            // query for the top compliments
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmdTop = new SqlCommand("SELECT TOP (@returnCount) Compliment, 'TotalCount'=count(*) FROM ConversationIndexData WHERE compliment NOT IN ('','None','N/A','No complaint') GROUP BY compliment ORDER BY count(*) DESC", conn);
                cmdTop.Parameters.AddWithValue("@returnCount", numberOfTopInsights);
                var topInsightReader = cmdTop.ExecuteReader();

                while (topInsightReader.Read())
                {
                    viewModel.TopInsights.Add(topInsightReader[0].ToString());
                    if (viewModel.TopInsights.Count == numberOfTopInsights) break;
                }
            }

            return viewModel;
        }

    }
}
