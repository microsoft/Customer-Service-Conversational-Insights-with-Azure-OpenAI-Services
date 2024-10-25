using Microsoft.GS.DPS.Model.ChatHost;
using Microsoft.GS.DPS.Storage.ChatSessions.Entities;
using Microsoft.GS.DPS.Storage.ChatSessions;
using Microsoft.KernelMemory;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using System.Text.Json;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using Microsoft.KernelMemory.Context;

namespace Microsoft.GS.DPS.API
{
    internal static class JsonSerializationOptionsCache
    {
        static internal JsonSerializerOptions JsonSerializationOptionsIgnoreCase { get; set; } = new JsonSerializerOptions() { 
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
    }

    public class ChatHost(MemoryWebClient kmClient, Kernel kernel, API.KernelMemory kernelMemory, ChatSessionRepository chatSessions)
    {
        private MemoryWebClient _kmClient = kmClient;
        private Kernel _kernel = kernel;
        private API.KernelMemory _kernelMemory = kernelMemory;
        private IChatCompletionService _chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        private ChatSessionRepository _chatSessions = chatSessions;
        private static string s_systemPrompt;
        private static string s_assistancePrompt;
        private static string s_additionalPrompt;


        string sessionId = string.Empty;
        ChatHistory chatHistory = null;
        ChatSession chatSession = null;

        //static constructor to load the system prompt text at once
        static ChatHost()
        {
            //Set Location of the System Prompt under running Assembly directory location.
            var assemblyLocation = Assembly.GetExecutingAssembly().Location;
            var assemblyDirectory = System.IO.Path.GetDirectoryName(assemblyLocation);
            // binding assembly directory with file path (Prompts/Chat_SystemPrompt.txt)
            var systemPromptFilePath = System.IO.Path.Combine(assemblyDirectory, "Prompts/Chat_SystemPrompt.txt");
            ChatHost.s_systemPrompt = System.IO.File.ReadAllText(systemPromptFilePath);
            ChatHost.s_assistancePrompt =
                    @"
                        Hello, I can provide you with knowledge based on registered documents and contents. 
                        Please feel free to ask me any questions related to those documents and contents.
                        However, please note that I cannot provide answers for forecasting, prediction, or projections.
                        ";

            // ChatHost.s_additionalPrompt = """
            //             If available, please include the name of the referencing document and its page number in your responses.
            //             Show the detail as much as possible in your answers.
            //             Data should be provided in the form of a table or a list.
            //             Do not use your own or general knowledge to formulate an answer.
            //             You should choose one of actions 
            //             - Make an answer with contents and recent chat history 
            //             - List up chatting history between user and you.
            //             """;

            ChatHost.s_additionalPrompt = "\n You should add citation (Document name and Page) per each every your answer statements.";

        }

        private async Task<ChatSession> makeNewSession(string? chatSessionId)
        {
            var sessionId = string.Empty;
            if(string.IsNullOrEmpty(chatSessionId))
            {
                sessionId = Guid.NewGuid().ToString();
            }
            else
            {
                sessionId = chatSessionId;
            }

            //Create New Chat History
            this.chatHistory = new ChatHistory();
            //Add the system prompt to the chat history
            this.chatHistory.AddSystemMessage(ChatHost.s_systemPrompt);

            //Create a new ChatSession Entity for Saving into Azure Cosmos
            return new ChatSession()
            {
                SessionId = sessionId, // New Session ID
                StartTime = DateTime.UtcNow // Session Created Time
            };

        }


        private async IAsyncEnumerable<string> GetAnswerWords(string answer)
        {
            var words = answer.Split(' ');
            foreach (var word in words)
            {
                yield return word;
                await Task.Delay(30);
            }
        }

        public async Task<ChatResponseAsync> ChatAsync(ChatRequest chatRequest)
        {
            var chatResponse = await Chat(chatRequest);
            return new ChatResponseAsync()
            {
                ChatSessionId = chatResponse.ChatSessionId,
                AnswerWords = GetAnswerWords(chatResponse.Answer),
                Answer = chatResponse.Answer,
                DocumentIds = chatResponse.DocumentIds,
                SuggestingQuestions = chatResponse.SuggestingQuestions
            };
        }

        public async Task<ChatResponse> Chat(ChatRequest chatRequest)
        {
            this.chatSession = await _chatSessions.GetSessionAsync(chatRequest.ChatSessionId);
            //just in case there is no chatSession in persistant storage
            //create a new chatSession
            if (this.chatSession == null) this.chatSession = await makeNewSession(chatRequest.ChatSessionId);

            //Rehydrate the ChatHistory from the ChatSession.ChatHistoryJson Field.
            //Due to BSON Deserializer issue, we are using JSON Deserializer
            if (this.chatSession != null && !String.IsNullOrEmpty(this.chatSession.ChatHistoryJson))
            {
                ChatHistory deserializedChatHistory = JsonSerializer.Deserialize<ChatHistory>(chatSession.ChatHistoryJson);
                this.chatHistory = deserializedChatHistory;
            }

            if (chatRequest.DocumentIds == null) chatRequest.DocumentIds = Array.Empty<string>();

            //define custom context for asking the question (max token)
            RequestContext context = new RequestContext()
            {
                Arguments = new Dictionary<string, object?>()
                {
                    { Microsoft.KernelMemory.Constants.CustomContext.Rag.Temperature, 0},
                    { Microsoft.KernelMemory.Constants.CustomContext.Rag.MaxTokens, 10000 }
                }
            };

            //Calculate prompt token size of prompt for the question and additional prompt with using Tiktoken
            
            
            //var tokenSize = chatRequest.Question.Length + ChatHost.s_additionalPrompt.Length;



            //Get the answer from the Kernel Memory
            var answer = await _kernelMemory.Ask(chatRequest.Question + ChatHost.s_additionalPrompt, chatRequest.DocumentIds, context: context);

            Console.WriteLine($"Question: {answer.Question}");
            Console.WriteLine($"Answer: {answer.Result}");

            //UpdateAsync System Prompt with the answer
            //replace {$answer} place holder in s_systemPrompt with the actual answer
            this.chatHistory[0].Content = s_systemPrompt.Replace("{$answer}", answer.Result);
            this.chatHistory[0].Role = AuthorRole.System;


            //Add User Message to the Chat History
            this.chatHistory.AddUserMessage("Currently Selected Documents are as below: \n" + string.Join("\n", answer.RelevantSources.Select(x => x.SourceName)) + "\n" + chatRequest.Question + ChatHost.s_additionalPrompt);

            ////Check History Rows and remove the oldest row if it exceeds max history count
            var historyCount = 10;
            // System prompt and first assistant prompt will be always there
            if (this.chatHistory.Count > historyCount + 2)
            {
                //Remove the oldest rows - Question and Answer
                this.chatHistory.RemoveRange(2, this.chatHistory.Count - (historyCount));
            }

            //UpdateAsync PromptExecutionSettings with the temperature
            var executionSettings = new PromptExecutionSettings()
            {
                ExtensionData = new Dictionary<string, object>
                                        {
                                            { "Temperature", 0.5 },
                                            { "MaxTokens", 16384  }
                                        }
            };

            //Get Response from ChatCompletionService
            ChatMessageContent returnedChatMessageContent = await _chatCompletionService.GetChatMessageContentAsync(chatHistory, executionSettings);

            //Just in case returnedChatMessageContent.Content has ```json ``` block, Strip it first
            if (returnedChatMessageContent.Content != null && returnedChatMessageContent.Content.Contains("```json", StringComparison.OrdinalIgnoreCase))
                returnedChatMessageContent.Content = returnedChatMessageContent.Content.Replace("```json", "").Replace("```", "");

            Answer answerObject = null;

            try
            {
                answerObject = JsonSerializer.Deserialize<Answer>(returnedChatMessageContent.Content, options: JsonSerializationOptionsCache.JsonSerializationOptionsIgnoreCase);

            }
            catch
            {
                answerObject = new Answer()
                {
                    Response = returnedChatMessageContent.Content,
                    Followings = new string[] { }
                };
            }

            if (returnedChatMessageContent.Content.Contains("I don't have enough information to provide an answer.", StringComparison.OrdinalIgnoreCase) ||
                returnedChatMessageContent.Content.Contains("No Information", StringComparison.OrdinalIgnoreCase))
            {
                answerObject.Response = "I don't have enough information to provide an answer. Would you please rephrase your question and ask me again?";
            }


            //Add Assistant Message and Data to the Chat History
            this.chatHistory.AddAssistantMessage($"this is the content for creating answer :\n{answer.Result}");
            this.chatHistory.AddAssistantMessage(returnedChatMessageContent.Content);
            

            //UpdateAsync last message updated Time
            this.chatSession.EndTime = DateTime.UtcNow;

            //Hydrate Chathistory back to ChatSession.ChatHistoryJson Field
            this.chatSession.ChatHistoryJson = JsonSerializer.Serialize<ChatHistory>(chatHistory);

            //UpdateAsync ChatSession Entity
            await _chatSessions.UpdateSessionAsync(this.chatSession);


            return new ChatResponse()
            {
                ChatSessionId = this.chatSession.SessionId,
                Answer = answerObject.Response,
                DocumentIds = chatRequest.DocumentIds,
                SuggestingQuestions = answerObject.Followings,
                Keywords = answerObject.Keywords
            };
        }
    }
}
