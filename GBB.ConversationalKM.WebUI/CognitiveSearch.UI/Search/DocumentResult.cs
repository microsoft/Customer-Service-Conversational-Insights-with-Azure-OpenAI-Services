// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveSearch.UI
{
    public class DocumentResult
    {
        public List<Facet> Facets { get; set; }
        public SearchDocument Result { get; set; }
        public Pageable<SearchResult<SearchDocument>> Results { get; set; }
        public int? Count { get; set; }
        public string Token { get; set; }
        public int StorageIndex { get; set; }        
        public string DecodedPath { get; set; }
        public List<object> Tags { get; set; }
        public string SearchId { get; set; }
        public string IdField { get; set; }
        public bool IsPathBase64Encoded { get; set; }
    }

    public class Facet
    {
        public string key { get; set; }
        public List<FacetValue> value { get; set; }
    }

    public class FacetValue
    {
        public string value { get; set; }
        public long? count { get; set; }
    }

}
