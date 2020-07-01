using System;
using System.IO;
using System.Text;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using System.Collections.Generic;

namespace GBB.ConversationalKM
{
    /// <summary>
    /// ----THIS FUNCTION IS CURRENTLY DISABLED, TO USE IT DELETE THE [Disable] DECORATION----
    /// This function is triggered when a new bot framework event blob is uploaded in the configured storage. 
    /// It perform a search to check if the conversationid is already created as an item in the index. If yes it appends the additional content. If no it creates a new item.
    /// Interactions with Azure Search is done through the PUSH API
    /// </summary>
    public static class PushMessagesToIndex
    {
        [Disable]
        [FunctionName("PushMessagesToIndex")]
        public static void Run([BlobTrigger("exportedevents/{name}", Connection = "conversationstoragev2")]Stream myBlob, string name, ILogger log)
        {
            log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            BotFrameworkDataExtractor de = new BotFrameworkDataExtractor();
            List<EventData> eds = de.ExtractFromBlob(myBlob);

            if (eds != null)
            {
                SearchIndexClient indexClient = new SearchIndexClient(
                    Environment.GetEnvironmentVariable("searchServiceName"),
                    Environment.GetEnvironmentVariable("searchIndexName"),
                    new SearchCredentials(Environment.GetEnvironmentVariable("searchApiKey")));

                List<Document> docsToPush = new List<Document>();

                foreach (EventData ed in eds)
                {
                    Document oldDoc = null;
                    try
                    {
                        oldDoc = indexClient.Documents.Get(ed.ConversationId);
                    }
                    catch (Exception ex)
                    { }


                    List<string> messagesToAdd = new List<string>();
                    if (oldDoc != null)
                    {
                        string[] oldMessages = oldDoc["messages"] as string[];
                        if (oldMessages != null)
                        {
                            messagesToAdd = new List<string>(oldMessages);
                        }
                    }

                    messagesToAdd.Add(string.Format("[{0}] {1}", ed.MessageType.ToString(), ed.MessageText));

                    Document newDoc = new Document();

                    newDoc.Add("conversation_id", ed.ConversationId);
                    newDoc.Add("last_modified", DateTime.UtcNow.ToString("O"));
                    newDoc.Add("messages", messagesToAdd);


                    docsToPush.Add(newDoc);
                    
                }

                //IndexAction.MergeOrUpload<Document>(newDoc);
                var batch = IndexBatch.MergeOrUpload<Document>(docsToPush);
                var res = indexClient.Documents.Index(batch);

            }
        }
    }
}
