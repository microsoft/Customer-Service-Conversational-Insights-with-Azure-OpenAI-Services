using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity = Microsoft.GS.DPS.Storage.Document.Entities;
namespace Microsoft.GS.DPS.Model.UserInterface
{
    public class DocumentQuerySet
    {
        public IEnumerable<Entity.Document> documents { get; set; }
        public Dictionary<string, List<string>> keywordFilterInfo { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public int CurrentPage { get; set; }
    }
}
