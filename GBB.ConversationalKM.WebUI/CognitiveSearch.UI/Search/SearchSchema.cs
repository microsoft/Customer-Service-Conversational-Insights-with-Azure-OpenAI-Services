// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;
using Microsoft.Spatial;
using System;
using System.Collections.Generic;

namespace CognitiveSearch.UI
{
    public enum PreferredFilter { None, MinValue, MaxValue, RangeMin, RangeMax, Range };

    [Serializable]
    public class SearchField
    {
        // Fields from Azure Search
        public string Name;
        public Type Type;
        public bool IsFacetable;
        public bool IsFilterable;
        public bool IsKey;
        public bool IsHidden;
        public bool IsSearchable;
        public bool IsSortable;

        // Fields to control
        public PreferredFilter FilterPreference;
    }

    [Serializable]
    public class SearchSchema
    {
        public SearchSchema()
        {
        }

        public Dictionary<string, SearchField> Fields = new Dictionary<string, SearchField>();
    }

    public static partial class Extensions
    {
        public static SearchField ToSearchField(this Azure.Search.Documents.Indexes.Models.SearchField field)
        {
            Type type;
            if (field.Type == SearchFieldDataType.Boolean) type = typeof(Boolean);
            else if (field.Type == SearchFieldDataType.DateTimeOffset) type = typeof(DateTime);
            else if (field.Type == SearchFieldDataType.Double) type = typeof(double);
            else if (field.Type == SearchFieldDataType.Int32) type = typeof(Int32);
            else if (field.Type == SearchFieldDataType.Int64) type = typeof(Int64);
            else if (field.Type == SearchFieldDataType.String) type = typeof(string);
            else if (field.Type == SearchFieldDataType.GeographyPoint) type = typeof(GeographyPoint);
   
            // Azure Search SearchFieldDataType objects don't follow value comparisons, so use overloaded string conversion operator to be a consistent representation
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.String).ToString()) type = typeof(string[]);
            else if (field.Type == SearchFieldDataType.Complex) type = typeof(string);
            else if (field.Type == SearchFieldDataType.Collection(SearchFieldDataType.Complex)) type = typeof(string[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.DateTimeOffset).ToString()) type = typeof(DateTime[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.GeographyPoint).ToString()) type = typeof(Microsoft.Spatial.GeographyPoint[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.Double).ToString()) type = typeof(double[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.Boolean).ToString()) type = typeof(Boolean[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.Int64).ToString()) type = typeof(Int32[]);
            else if (field.Type.ToString() == SearchFieldDataType.Collection(SearchFieldDataType.Int64).ToString()) type = typeof(Int64[]);
            else
            {
                throw new ArgumentException($"Cannot map {field.Type} to a C# type");
            }
            return new SearchField()
            {
                Name = field.Name,
                Type = type,
                IsFacetable = field.IsFacetable ?? false,
                IsFilterable = field.IsFilterable ?? false,
                IsKey = field.IsKey ?? false,
                IsHidden = field.IsHidden ?? false,
                IsSearchable = field.IsSearchable ?? false,
                IsSortable = field.IsSortable ?? false
            };
        }

        public static SearchSchema AddFields(this SearchSchema schema, IList<Azure.Search.Documents.Indexes.Models.SearchField> fields)
        {
            foreach (var field in fields)
            {
                schema.Fields[field.Name] = field.ToSearchField();
            }
            return schema;
        }
    }
}
