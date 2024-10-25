using Microsoft.KernelMemory.Context;
using Microsoft.KernelMemory;

namespace Microsoft.GS.DPS.Model.KernelMemory
{
    public class SearchParameter
    {
        public SearchParameter()
        {
            query = string.Empty;
            MemoryFilter = null;
            MemoryFilters = null;
            minRelevance = 0.0;
            limit = -1;
            Context = null;
        }

        public string query { get; set; }
        public MemoryFilter? MemoryFilter { get; set; }
        public ICollection<MemoryFilter>? MemoryFilters { get; set; }
        public double minRelevance { get; set; }
        public int limit { get; set; }
        public IContext? Context { get; set; }
    }
}
