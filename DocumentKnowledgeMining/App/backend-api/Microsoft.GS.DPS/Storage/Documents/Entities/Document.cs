// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.GS.DPS.Storage.Components;

namespace Microsoft.GS.DPS.Storage.Document.Entities
{
    public class Document: CosmosDBEntityBase
    {
        public string DocumentId { get; set; }
        public string FileName  { get; set; }
        public Dictionary<string,string>? Keywords { get; set; }
        public DateTime ImportedTime { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public string MimeType { get; set; }
        public string Summary { get; set; }
    }
}
