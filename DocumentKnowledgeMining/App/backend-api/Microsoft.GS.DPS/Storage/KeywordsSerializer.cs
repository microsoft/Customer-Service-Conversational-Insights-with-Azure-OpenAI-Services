using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.IO;

namespace Microsoft.GS.DPS.Storage.Document
{
    public class MongoDbConfig
    {
        public static void RegisterClassMaps()
        {
            BsonClassMap.RegisterClassMap<Entities.Document>(cm =>
            {
                cm.AutoMap();
                cm.MapMember(c => c.Keywords).SetSerializer(new KeywordsSerializer());
            });
        }
    }

    public class KeywordsSerializer : SerializerBase<List<Dictionary<string, List<string>>>>
    {
        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, List<Dictionary<string, List<string>>> value)
        {
            context.Writer.WriteStartArray();
            foreach (var dict in value)
            {
                context.Writer.WriteStartDocument();
                foreach (var kvp in dict)
                {
                    context.Writer.WriteName(kvp.Key);
                    context.Writer.WriteStartArray();
                    foreach (var item in kvp.Value)
                    {
                        context.Writer.WriteString(item);
                    }
                    context.Writer.WriteEndArray();
                }
                context.Writer.WriteEndDocument();
            }
            context.Writer.WriteEndArray();
        }

        public override List<Dictionary<string, List<string>>> Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var list = new List<Dictionary<string, List<string>>>();
            context.Reader.ReadStartArray();
            while (context.Reader.ReadBsonType() != BsonType.EndOfDocument)
            {
                var dict = new Dictionary<string, List<string>>();
                context.Reader.ReadStartDocument();
                while (context.Reader.ReadBsonType() != BsonType.EndOfDocument)
                {
                    var key = context.Reader.ReadName();
                    var innerList = new List<string>();
                    context.Reader.ReadStartArray();
                    while (context.Reader.ReadBsonType() != BsonType.EndOfDocument)
                    {
                        innerList.Add(context.Reader.ReadString());
                    }
                    context.Reader.ReadEndArray();
                    dict[key] = innerList;
                }
                context.Reader.ReadEndDocument();
                list.Add(dict);
            }
            context.Reader.ReadEndArray();
            return list;
        }
    }
}
