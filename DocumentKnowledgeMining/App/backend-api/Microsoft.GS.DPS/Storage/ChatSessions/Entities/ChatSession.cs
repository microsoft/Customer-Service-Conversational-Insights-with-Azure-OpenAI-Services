using Microsoft.GS.DPS.Storage.Components;
using Microsoft.SemanticKernel.ChatCompletion;

namespace Microsoft.GS.DPS.Storage.ChatSessions.Entities
{
    public class ChatSession : CosmosDBEntityBase
    {
        public string SessionId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string ChatHistoryJson { get; set; }
    }
}
