using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace GBB.ConversationalKM
{
    public interface IDataExtractor
    {
        public List<EventData> ExtractFromBlob(Stream blob);
    }
}
