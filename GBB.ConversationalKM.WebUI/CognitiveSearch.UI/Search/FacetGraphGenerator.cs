using Azure.Search.Documents.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CognitiveSearch.UI
{
    public class NodeInfo
    {
        public NodeInfo(int index, int colorId)
        {
            Index = index;
            ColorId = colorId;
            LayerCornerStone = -1;
        }
        public int Index { get; set; }
        public int ColorId { get; set; }
        public int Layer { get; set; }
        public int Distance { get; set; }
        public int ChildCount { get; set; }
        public int LayerCornerStone { get; set; }
    }

    public class FacetGraphGenerator
    {
        private DocumentSearchClient _searchHelper;

        public FacetGraphGenerator(DocumentSearchClient searchClient)
        {
            _searchHelper = searchClient;
        }

        public string GetFacetGraphNodes(string q, List<string> facetNames, int maxLevels, int maxNodes)
        {
            // Calculate nodes for N levels 
            int CurrentNodes = 0;
            int originalDistance = 100;

            List<FDGraphEdges> FDEdgeList = new List<FDGraphEdges>();
            // Create a node map that will map a facet to a node - nodemap[0] always equals the q term

            var NodeMap = new Dictionary<string, NodeInfo>();

            NodeMap[q] = new NodeInfo(CurrentNodes, 0)
            {
                Distance = originalDistance,
                Layer = 0
            };

            // If blank search, assume they want to search everything
            if (string.IsNullOrWhiteSpace(q))
            {
                q = "*";
            }

            List<string> currentLevelTerms = new List<string>();

            List<string> NextLevelTerms = new List<string>();
            NextLevelTerms.Add(q);

            // Iterate through the nodes up to MaxLevels deep to build the nodes or when I hit max number of nodes
            for (var CurrentLevel = 0; CurrentLevel < maxLevels && maxNodes > 0; ++CurrentLevel, maxNodes /= 2)
            {
                currentLevelTerms = NextLevelTerms.ToList();
                NextLevelTerms.Clear();
                var levelNodeCount = 0;

                NodeInfo densestNodeThisLayer = null;
                var density = 0;

                foreach (var k in NodeMap)
                    k.Value.Distance += originalDistance;

                foreach (var t in currentLevelTerms)
                {
                    if (levelNodeCount >= maxNodes)
                        break;

                    int facetsToGrab = 10;
                    if (maxNodes < 10)
                    {
                        facetsToGrab = maxNodes;
                    }
                    SearchResults<SearchDocument> response = _searchHelper.GetFacets(t, facetNames, facetsToGrab);
                    if (response != null)
                    {
                        int facetColor = 0;

                        foreach (var facetName in facetNames)
                        {
                            var facetVals = (response.Facets)[facetName];
                            facetColor++;

                            foreach (FacetResult facet in facetVals)
                            {
                                var facetValue = facet.Value.ToString();

                                NodeInfo nodeInfo = new NodeInfo(-1, -1);
                                if (NodeMap.TryGetValue(facetValue, out nodeInfo) == false)
                                {
                                    // This is a new node
                                    ++levelNodeCount;
                                    NodeMap[facetValue] = new NodeInfo(++CurrentNodes, facetColor)
                                    {
                                        Distance = originalDistance,
                                        Layer = CurrentLevel + 1
                                    };

                                    if (CurrentLevel < maxLevels)
                                    {
                                        NextLevelTerms.Add(facetValue);
                                    }
                                }

                                // Add this facet to the fd list
                                var newNode = NodeMap[facetValue];
                                var oldNode = NodeMap[t];
                                if (oldNode != newNode)
                                {
                                    oldNode.ChildCount += 1;
                                    if (densestNodeThisLayer == null || oldNode.ChildCount > density)
                                    {
                                        density = oldNode.ChildCount;
                                        densestNodeThisLayer = oldNode;
                                    }

                                    FDEdgeList.Add(new FDGraphEdges
                                    {
                                        source = oldNode.Index,
                                        target = newNode.Index,
                                        distance = newNode.Distance
                                    });
                                }
                            }
                        }
                    }
                }

                if (densestNodeThisLayer != null)
                    densestNodeThisLayer.LayerCornerStone = CurrentLevel;
            }

            // Create nodes
            var options = new JsonWriterOptions
            {
                Indented = true
            };
            using (var stream = new MemoryStream())
            {
                using (var writer = new Utf8JsonWriter(stream, options))
                {
                    writer.WriteStartObject();
                    writer.WritePropertyName("links");
                    writer.WriteStartArray();
                    foreach (FDGraphEdges entry in FDEdgeList)
                    {
                        var jsonDocument = JsonDocument.Parse(JsonSerializer.Serialize(entry));
                        jsonDocument.RootElement.WriteTo(writer);
                    }
                    writer.WriteEndArray();
                    writer.WritePropertyName("nodes");
                    writer.WriteStartArray();
                    foreach (KeyValuePair<string, NodeInfo> entry in NodeMap)
                    {
                        var jsonDocument = JsonDocument.Parse(JsonSerializer.Serialize(new
                        {
                            name = entry.Key,
                            id = entry.Value.Index,
                            color = entry.Value.ColorId,
                            layer = entry.Value.Layer,
                            cornerStone = entry.Value.LayerCornerStone
                        }));
                        jsonDocument.RootElement.WriteTo(writer);
                    }
                    writer.WriteEndArray();
                    writer.WriteEndObject();
                }
                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }

        public class FDGraphEdges
        {
            public int source { get; set; }
            public int target { get; set; }
            public int distance { get; set; }
        }
    }
}
