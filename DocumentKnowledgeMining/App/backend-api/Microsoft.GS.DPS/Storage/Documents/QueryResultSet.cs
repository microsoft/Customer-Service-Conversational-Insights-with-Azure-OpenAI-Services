using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Storage.Document
{
    public class QueryResultSet
    {
        public IEnumerable<Entities.Document> Results { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public int CurrentPage { get; set; }
    }
}
