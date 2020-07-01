using System;
using System.Collections.Generic;
using System.Text;

namespace GBB.ConversationalKM
{
    public class Conversation
    {
        public string ConversationId { get; set; }
        public List<EventData> Messages { get; }

        public Conversation()
        {
            Messages = new List<EventData>();
        }
    }
}
