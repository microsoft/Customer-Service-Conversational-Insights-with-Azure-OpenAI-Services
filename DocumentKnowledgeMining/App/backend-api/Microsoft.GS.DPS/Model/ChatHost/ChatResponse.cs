using Microsoft.SemanticKernel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.GS.DPS.Model.ChatHost
{
    public class ChatResponse
    {
        public string ChatSessionId { get; set; }
        public string Answer { get; set; }
        public string[] DocumentIds { get; set; }
        public string[] SuggestingQuestions { get; set; }
        public string[] Keywords { get; set; }
    }

    public class ChatResponseAsync
    {
        public string ChatSessionId { get; set; }
        public IAsyncEnumerable<string> AnswerWords { get; set; }
        public string Answer { get; set; }
        public string[] DocumentIds { get; set; }
        public string[] SuggestingQuestions { get; set; }
        public string[] Keywords { get; set; }
    }
}
