namespace Microsoft.GS.DPSHost.AppConfiguration
{
    public class Services
    {
        public CognitiveServiceConfig CognitiveService { get; set; }
        public KernelMemoryConfig KernelMemory { get; set; }
        public PersistentStorageConfig PersistentStorage { get; set; }
        public AzureAISearchConfig AzureAISearch { get; set; }

        public class AzureAISearchConfig
        {
            public string Endpoint { get; set; }
            public string APIKey { get; set; }
        }

        public class CognitiveServiceConfig
        {
            public DocumentIntelligenceConfig DocumentIntelligence { get; set; }

            public class DocumentIntelligenceConfig
            {
                public string Endpoint { get; set; }
                public string APIKey { get; set; }
            }
        }

        public class KernelMemoryConfig
        {
            public string Endpoint { get; set; }
        }

        public class PersistentStorageConfig
        {
            public CosmosMongoConfig CosmosMongo { get; set; }

            public class CosmosMongoConfig
            {
                public string ConnectionString { get; set; }
                public CosmosServiceConfig Collections { get; set; }

                public class CosmosServiceConfig
                {
                    public ChatHistoryConfig ChatHistory { get; set; }
                    public DocumentStorageConfig DocumentManager { get; set; }

                    public class ChatHistoryConfig
                    {
                        public string Database { get; set; }
                        public string Collection { get; set; }
                    }

                    public class DocumentStorageConfig
                    {
                        public string Database { get; set; }
                        public string Collection { get; set; }
                    }
                }
            }
        }
    }
}
