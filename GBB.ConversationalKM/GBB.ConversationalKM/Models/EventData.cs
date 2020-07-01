using System;
using System.Collections.Generic;
using System.Text;

namespace GBB.ConversationalKM
{
    public class EventData
    {
        public string ConversationId { get; set; }
        public string Value { get; set; }
        public string UserId { get; set; }
        public string EventType { get; set; } //"MessageFromUser", "MessageFromBotOrAgent", "IntentRecognized"
        public DateTime EventTime { get; set; }
        public Dictionary<string,string> CustomProperties { get; set; }

        public EventData()
        {
            CustomProperties = new Dictionary<string, string>();
        }
    }

     
}
