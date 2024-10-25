namespace Microsoft.GS.DPS.Model.KernelMemory
{
    public class DocumentImportedResult
    {
        public string DocumentId { get; set; }
        public DateTime ImportedTime { get; set; }
        public string FileName { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public string MimeType { get; set; }
        public Dictionary<string, string>? Keywords { get; set; }
        public string Summary { get; set; }
    }
}
