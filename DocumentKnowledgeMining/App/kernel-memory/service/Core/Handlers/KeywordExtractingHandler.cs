// Copyright (c) Microsoft. All rights reserved.

using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.KernelMemory.Diagnostics;
using Microsoft.KernelMemory.Pipeline;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using static Microsoft.KernelMemory.Pipeline.DataPipeline;

namespace Microsoft.KernelMemory.Handlers;

public sealed class KeywordExtractingHandler : IPipelineStepHandler
{
    public string StepName { get; }
    private readonly ILogger<KeywordExtractingHandler> _log;
    private readonly IPipelineOrchestrator _orchestrator;
    private readonly Kernel _kernel;
    private readonly KernelMemoryConfig? _config = null;

    public KeywordExtractingHandler(
        string stepName,
        IPipelineOrchestrator orchestrator,
        KernelMemoryConfig config = null,
        ILoggerFactory? loggerFactory = null
        )
    {
        this.StepName = stepName;
        this._log = (loggerFactory ?? DefaultLogger.Factory).CreateLogger<KeywordExtractingHandler>();
        this._orchestrator = orchestrator;
        this._config = config;

        //init Semantic Kernel
        this._kernel = Kernel.CreateBuilder()
            .AddAzureOpenAIChatCompletion(deploymentName: (string)this._config.Services["AzureOpenAIText"]["Deployment"],
                                                endpoint: (string)this._config.Services["AzureOpenAIText"]["Endpoint"],
                                                  apiKey: (string)this._config.Services["AzureOpenAIText"]["APIKey"])
            .Build();
    }

    public async Task<(bool success, DataPipeline updatedPipeline)> InvokeAsync(DataPipeline pipeline, CancellationToken cancellationToken = default)
    {
        this._log.LogDebug("Extracting Keywords from the content", pipeline.Index, pipeline.DocumentId);

        foreach (FileDetails uploadedFile in pipeline.Files)
        {
            Dictionary<string, DataPipeline.GeneratedFileDetails> extractedTagsFile = new();

            foreach (KeyValuePair<string, DataPipeline.GeneratedFileDetails> generatedFile in uploadedFile.GeneratedFiles)
            {
                var file = generatedFile.Value;

                if (file.AlreadyProcessedBy(this))
                {
                    this._log.LogDebug("File {FileName} has already been processed by {HandlerName}", file.Name, this.StepName);
                    continue;
                }

                // Extract keywords from the file
                if (file.ArtifactType == DataPipeline.ArtifactTypes.ExtractedText)
                {
                    this._log.LogDebug("Extracting Tags from the file {FileName}", file.Name);

                    var sourceFile = uploadedFile.Name;
                    string extactedFileContent = string.Empty;

                    BinaryData fileContent = await this._orchestrator.ReadFileAsync(pipeline, file.Name, cancellationToken).ConfigureAwait(false);

                    //set file content to extactedFileContent
                    extactedFileContent = fileContent.ToString();

                    //extract tags as a Json file
                    var destFile = $"{uploadedFile.Name}.tags.json";

                    var chat = this._kernel.GetRequiredService<IChatCompletionService>();
                    var chatHistory = new ChatHistory();

                    var systemMessage = """
                        You are an assistant to analyze Content and Extract Tags by Content.
                        [EXTRACT TAGS RULES]
                        IT SHOULD BE A LIST OF DICTIONARIES WITH CATEGORY AND TAGS
                        TAGS SHOULD BE CATEGORY SPECIFIC
                        TAGS SHOULD BE A LIST OF STRINGS
                        TAGS COUNT CAN BE UP TO 10 UNDER A CATEGORY
                        CATEGORY COUNT CAN BE UP TO 10
                        DON'T ADD ANY MARKDOWN EXPRESSION IN YOUR RESPONSE
                        [END RULES]

                        [EXAMPLE]
                        [
                            {
                                [category1": ["tag1", "tag2", "tag3"]
                            },
                            {
                                "category2": ["tag1", "tag2", "tag3"]
                            }
                        ]
                        [END EXAMPLE]
                        """;

                    chatHistory.AddSystemMessage(systemMessage);
                    chatHistory.AddUserMessage($"Extract tags from this content : {extactedFileContent} \n The format should be Json but Markdown expression.");

                    var executionParam = new PromptExecutionSettings()
                    {
                        ExtensionData = new Dictionary<string, object>
                                {
                                    { "Temperature", 0 }
                                }
                    };

                    ChatMessageContent response = null;

                    try
                    {
                        response = await chat.GetChatMessageContentAsync(chatHistory: chatHistory, executionSettings: executionParam, cancellationToken: cancellationToken).ConfigureAwait(true);

                        //Make BinaryData from response
                        BinaryData responseBinaryData = new(response.ToString());
                        await this._orchestrator.WriteFileAsync(pipeline, destFile, responseBinaryData, cancellationToken).ConfigureAwait(false);

                        //Add Tags from Extracted Keywords
                        List<Dictionary<string, List<string>>> tags = JsonSerializer.Deserialize<List<Dictionary<string, List<string>>>>(response.ToString());

                        Dictionary<string, List<string>> keyValueCollection = new Dictionary<string, List<string>>();

                        foreach (var category in tags)
                        {
                            foreach (var kvp in category)
                            {
                                pipeline.Tags.Add(kvp.Key, kvp.Value);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        this._log.LogError(ex, "Error while extracting tags from the file {FileName}", file.Name);
                        await this._orchestrator.WriteFileAsync(pipeline, destFile, new BinaryData("[]"), cancellationToken).ConfigureAwait(false);
                        continue;
                    }
                }
            }
            uploadedFile.MarkProcessedBy(this);
        }

        return (true, pipeline);
    }

}

