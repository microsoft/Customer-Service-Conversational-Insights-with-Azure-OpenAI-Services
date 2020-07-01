// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.Azure.Search.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveSearch.UI
{
    public class DocumentResult
    {
        public List<object> Facets { get; set; }
        public Document Result { get; set; }
        public IList<SearchResult<Document>> Results { get; set; }
        public int? Count { get; set; }
        public string Token { get; set; }
        public int StorageIndex { get; set; }        
        public string DecodedPath { get; set; }
        public List<object> Tags { get; set; }
        public string SearchId { get; set; }
        public string IdField { get; set; }
        public bool IsPathBase64Encoded { get; set; }
    }
}
