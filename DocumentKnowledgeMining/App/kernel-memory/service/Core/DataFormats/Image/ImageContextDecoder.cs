
using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.KernelMemory.Diagnostics;
using Microsoft.KernelMemory.Pipeline;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Azure.AI.OpenAI;
using System.Collections.Generic;

namespace Microsoft.KernelMemory.DataFormats.Image
{
    public sealed class ImageContextDecoder : IContentDecoder
    {
        private readonly ILogger<ImageContextDecoder>? _log = null;
        private readonly KernelMemoryConfig? _config = null;
        private readonly Kernel _kernel;
        private string _mimeType;

        // Parameterized constructor that invokes the default constructor
        public ImageContextDecoder(KernelMemoryConfig config, ILoggerFactory? loggerFactory = null)
        {
            this._log = (loggerFactory ?? DefaultLogger.Factory).CreateLogger<ImageContextDecoder>();
            this._config = config;

            //init Semantic Kernel
            this._kernel = Kernel.CreateBuilder()
                .AddAzureOpenAIChatCompletion(deploymentName: (string)this._config.Services["AzureOpenAIText"]["Deployment"],
                                                    endpoint: (string)this._config.Services["AzureOpenAIText"]["Endpoint"],
                                                      apiKey: (string)this._config.Services["AzureOpenAIText"]["APIKey"])
                .Build();
        }

        public async Task<FileContent> DecodeAsync(string filename, CancellationToken cancellationToken = default)
        {
            using var stream = File.OpenRead(filename);
            return await this.DecodeAsync(stream, cancellationToken).ConfigureAwait(true);
        }

        public async Task<FileContent> DecodeAsync(BinaryData data, CancellationToken cancellationToken = default)
        {
            this._log.LogDebug("Extracting text from image file");

            var chat = this._kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();
            chatHistory.AddSystemMessage("You are an assistant to analyze Image and show detail descriptions.");

            ReadOnlyMemory<byte> imageContent = data.ToMemory();
            var content = new ImageContent(data: imageContent, mimeType: this._mimeType);

            var messageCollections = new ChatMessageContentItemCollection
            {
                 new TextContent(
                        """
                            Analyze Image and show your detail investigation result less than 4000 tokens.
                            Don't say 'The image depicts a ...' or 'The image shows a ...' or 'The image is of a ...'.
                            Put the summary at first then describe the details following.
                        """),
                 content
            };

            chatHistory.AddUserMessage(messageCollections);

            var executionParam = new PromptExecutionSettings()
            {
                ExtensionData = new Dictionary<string, object>
                                {
                                    { "Temperature", 0 }
                                }
            };

            var response = await chat.GetChatMessageContentAsync(chatHistory: chatHistory, executionSettings: executionParam, cancellationToken: cancellationToken).ConfigureAwait(true);
            var result = new FileContent(MimeTypes.PlainText);
            result.Sections.Add(new(1, response.ToString().Trim(), true));

            return result;
        }

        public async Task<FileContent> DecodeAsync(Stream data, CancellationToken cancellationToken = default)
        {
            this._log.LogDebug("Extracting text from image file");
            using var memoryStream = new MemoryStream();
            await data.CopyToAsync(memoryStream, cancellationToken).ConfigureAwait(true);
            BinaryData binaryData = new(memoryStream.ToArray());

            return await this.DecodeAsync(binaryData, cancellationToken).ConfigureAwait(true);
        }

        public bool SupportsMimeType(string mimeType)
        {
            var isSupport = mimeType != null && (
                mimeType.StartsWith(MimeTypes.ImageJpeg, StringComparison.OrdinalIgnoreCase) ||
                mimeType.StartsWith(MimeTypes.ImagePng, StringComparison.OrdinalIgnoreCase));

            if (isSupport)
            {
                if (mimeType != null && mimeType.StartsWith(MimeTypes.ImageJpeg, StringComparison.OrdinalIgnoreCase))
                {
                    this._mimeType = MimeTypes.ImageJpeg;
                }
                else if (mimeType != null && mimeType.StartsWith(MimeTypes.ImagePng, StringComparison.OrdinalIgnoreCase))
                {
                    this._mimeType = MimeTypes.ImagePng;
                }
                else
                {
                    this._mimeType = MimeTypes.ImageJpeg;
                }
            }

            return isSupport;

        }
    }
}
