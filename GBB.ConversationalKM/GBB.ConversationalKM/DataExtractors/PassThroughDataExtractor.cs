using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace GBB.ConversationalKM
{
    class PassThroughDataExtractor : IDataExtractor
    {
        public List<EventData> ExtractFromBlob(Stream blob)
        {
            List<EventData> result = new List<EventData>();

            using (StreamReader reader = new StreamReader(blob, Encoding.UTF8))
            {
                string blobContent = reader.ReadToEnd();
                EventData ed = JsonConvert.DeserializeObject<EventData>(blobContent);

                result.Add(ed);
            }

            return result;
        }
    }
}
