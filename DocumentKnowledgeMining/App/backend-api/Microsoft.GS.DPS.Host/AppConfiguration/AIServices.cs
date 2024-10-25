using System.Text.Json.Serialization;

namespace Microsoft.GS.DPSHost.AppConfiguration
{
    public class AIServices
    {
        [JsonPropertyName("GPT-4o")]
        public ServiceConfig GPT_4o { get; set; }

        [JsonPropertyName("GPT-4o-mini")]
        public ServiceConfig GPT_4o_Mini { get; set; }

        public ServiceConfig TextEmbedding { get; set; }

        public class ServiceConfig
        {
            public string Endpoint { get; set; }
            public string Key { get; set; }
            public string ModelName { get; set; }
        }
    }
}
