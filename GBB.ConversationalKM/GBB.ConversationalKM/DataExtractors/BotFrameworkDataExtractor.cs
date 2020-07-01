using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace GBB.ConversationalKM
{
    public class BotFrameworkDataExtractor : IDataExtractor
    {
        public List<EventData> ExtractFromBlob(Stream blob)
        {
            List<EventData> result = new List<EventData>();

            using (StreamReader reader = new StreamReader(blob, Encoding.UTF8))
            {
                //each blob file can have multiple json separated by a new line
                string[] multipleEvents = reader.ReadToEnd().Split("\n");

                foreach (string blobEvent in multipleEvents)
                {
                    BotFrameworkEvent bfEvent = JsonConvert.DeserializeObject<BotFrameworkEvent>(blobEvent);
                                       
                    if (bfEvent != null && (bfEvent.@event[0].name == "BotMessageReceived" || bfEvent.@event[0].name == "BotMessageSend" || bfEvent.@event[0].name == "LuisResult"))
                    {
                        string textMessage = "";
                        JObject textDimension = bfEvent.context.custom.dimensions.FirstOrDefault(d => d.Value<string>("text") != null);
                        if(textDimension != null)
                        {
                            textMessage = textDimension.Value<string>("text");
                        }

                        string sessionId = bfEvent.context.session.id.Split('|')[0];

                        string eventType = null;
                        if (bfEvent.@event[0].name == "BotMessageReceived")
                            eventType = "MessageFromUser";
                        else if (bfEvent.@event[0].name == "BotMessageSend")
                            eventType = "MessageFromBotOrAgent";

                        DateTime eventTime = bfEvent.context.data.eventTime; 

                        EventData ed = new EventData() { ConversationId = sessionId, Value = textMessage, EventType = eventType, EventTime = eventTime };

                        foreach(JObject jo in bfEvent.context.custom.dimensions)
                        {
                            ed.CustomProperties.Add(
                                jo.ToObject<Dictionary<string, string>>().First().Key,
                                jo.ToObject<Dictionary<string, string>>().First().Value);
                        }

                        result.Add(ed);
                    }
                }
            }

            return result;
        }
    }

    

   

   
}
