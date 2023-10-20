
namespace CognitiveSearch.UI.Configuration
{
    public class AppConfig
    {
        public ApiConfig ApiConfig { get; set; }

        public OrganizationConfig Organization { get; set; }

        public bool Customizable { get; set; }

        public string UploadDisclaimer { get; set; }
    }
}