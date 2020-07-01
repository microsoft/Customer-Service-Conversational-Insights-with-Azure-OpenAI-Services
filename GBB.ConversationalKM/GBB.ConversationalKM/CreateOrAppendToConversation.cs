using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Linq;

namespace GBB.ConversationalKM
{
    public static class CreateOrAppendToConversation
    {
        [FunctionName("CreateOrAppendToConversation")]
        public static void Run([BlobTrigger("conversationkm-raw/{name}", Connection = "conversationstoragev2")]Stream myBlob, string name, ILogger log)
        {
            log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            List<EventData> eds = null;
            try
            {
                BotFrameworkDataExtractor de = new BotFrameworkDataExtractor();
                eds = de.ExtractFromBlob(myBlob);
            }
            catch { }

            if (eds != null)
            {
                BlobServiceClient blobServiceClient = new BlobServiceClient(Environment.GetEnvironmentVariable("conversationstoragev2"));
                BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(Environment.GetEnvironmentVariable("outputContainerName"));

                foreach (EventData ed in eds)
                {
                    BlobClient blobClient = blobContainerClient.GetBlobClient($"{ed.ConversationId}.json");

                    try
                    {
                        BlobDownloadInfo download = blobClient.Download();
                        using (StreamReader reader = new StreamReader(download.Content))
                        {
                            string content = reader.ReadToEnd();
                            Conversation existingConversation = JsonConvert.DeserializeObject<Conversation>(content);

                            existingConversation.Messages.Add(ed);

                            existingConversation.Messages.Sort((x, y) => x.EventTime.CompareTo(y.EventTime));

                            UploadConversation(existingConversation, blobClient);

                        }
                    }
                    catch (Azure.RequestFailedException ex)
                    {
                        if (ex.Status == 404)
                        {
                            Conversation conversation = new Conversation() { ConversationId = ed.ConversationId };
                            conversation.Messages.Add(ed);

                            UploadConversation(conversation, blobClient);
                        }
                    }


                }
            }
        }

        private static void UploadConversation(Conversation conversation, BlobClient blobClient)
        {
            string content = JsonConvert.SerializeObject(conversation);
            byte[] byteArray = Encoding.UTF8.GetBytes(content);
            using (MemoryStream stream = new MemoryStream(byteArray))
            {
                blobClient.Upload(stream, true);
            }
        }
    }
}
