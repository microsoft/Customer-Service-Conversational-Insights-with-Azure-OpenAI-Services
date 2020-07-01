// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.Azure.Search.Models;
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
        public bool IsRetrievable;
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
        public static SearchField ToSearchField(this Field field)
        {
            Type type;
            if (field.Type == DataType.Boolean) type = typeof(Boolean);
            else if (field.Type == DataType.DateTimeOffset) type = typeof(DateTime);
            else if (field.Type == DataType.Double) type = typeof(double);
            else if (field.Type == DataType.Int32) type = typeof(Int32);
            else if (field.Type == DataType.Int64) type = typeof(Int64);
            else if (field.Type == DataType.String) type = typeof(string);
            else if (field.Type == DataType.GeographyPoint) type = typeof(Microsoft.Spatial.GeographyPoint);
   
            // Azure Search DataType objects don't follow value comparisons, so use overloaded string conversion operator to be a consistent representation
            else if ((string)field.Type == (string)DataType.Collection(DataType.String)) type = typeof(string[]);
            else if (field.Type == DataType.Complex) type = typeof(string);
            else if (field.Type == DataType.Collection(DataType.Complex)) type = typeof(string[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.DateTimeOffset)) type = typeof(DateTime[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.GeographyPoint)) type = typeof(Microsoft.Spatial.GeographyPoint[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.Double)) type = typeof(double[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.Boolean)) type = typeof(Boolean[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.Int64)) type = typeof(Int32[]);
            else if ((string)field.Type == (string)DataType.Collection(DataType.Int64)) type = typeof(Int64[]);
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
                IsRetrievable = field.IsRetrievable ?? false,
                IsSearchable = field.IsSearchable ?? false,
                IsSortable = field.IsSortable ?? false
            };
        }

        public static SearchSchema AddFields(this SearchSchema schema, IEnumerable<Field> fields)
        {
            foreach (var field in fields)
            {
                schema.Fields[field.Name] = field.ToSearchField();
            }
            return schema;
        }
    }
}
