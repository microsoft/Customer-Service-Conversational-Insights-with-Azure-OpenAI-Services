using Microsoft.KernelMemory;
using Microsoft.KernelMemory.Context;

namespace Microsoft.GS.DPS.Model.KernelMemory
{
    public class AskParameter
    {
        public AskParameter()
        {
            question = string.Empty;
            documents = Array.Empty<string>();
            //MemoryFilter = null;
            //MemoryFilters = null;
            //minRelevance = 0.0;
            //Context = null;
        }

        public string question { get; set; }
        public string[] documents { get; set; }
        //public MemoryFilter? MemoryFilter { get; set; }
        //public ICollection<MemoryFilter>? MemoryFilters { get; set; }
        //public double minRelevance { get; set; }
        //public IContext? Context { get; set; }
    }
}
