// Copyright (c) Microsoft. All rights reserved.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.KernelMemory.Diagnostics;
using Azure.AI.DocumentIntelligence;
using Microsoft.Extensions.Configuration;
using Microsoft.KernelMemory.Pipeline;
using Azure.Core;
using Azure;
using Microsoft.KernelMemory.Configuration;

namespace Microsoft.KernelMemory.DataFormats.Pdf;
public sealed class PdfMarkdownDecoder(KernelMemoryConfig config, ILoggerFactory? loggerFactory = null) : IContentDecoder
{
    private readonly ILogger<PdfDecoder> _log = (loggerFactory ?? DefaultLogger.Factory).CreateLogger<PdfDecoder>();
    private DocumentIntelligenceClient _client = null!; // Initialize _client as null
    private string _apiKey = (string)config.Services["AzureAIDocIntel"]["APIKey"];
    private string _endpoint = (string)config.Services["AzureAIDocIntel"]["Endpoint"];

    /// <inheritdoc />
    public bool SupportsMimeType(string mimeType)
    {
        return mimeType != null && mimeType.StartsWith(MimeTypes.Pdf, StringComparison.OrdinalIgnoreCase);
    }

    public async Task<FileContent> DecodeAsync(string filename, CancellationToken cancellationToken = default)
    {
        using var stream = File.OpenRead(filename);
        return await this.DecodeAsync(stream, cancellationToken).ConfigureAwait(true);
    }

    public async Task<FileContent> DecodeAsync(BinaryData data, CancellationToken cancellationToken = default)
    {
        var content = new AnalyzeDocumentContent() { Base64Source = data };

        //this invocation should be blocking during process
        DocumentIntelligenceClientOptions options = new()
        {
            Retry = { Delay = TimeSpan.FromSeconds(90), MaxDelay = TimeSpan.FromSeconds(180), MaxRetries = 3, Mode = RetryMode.Exponential },
        };

        this._client = new DocumentIntelligenceClient(new Uri(this._endpoint), new AzureKeyCredential(this._apiKey), options);

        Operation<AnalyzeResult> operation = null;
        operation = await this._client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", content, outputContentFormat: ContentFormat.Markdown, cancellationToken: cancellationToken).ConfigureAwait(false);

        AnalyzeResult result = operation.Value;

        var extracted_result = new FileContent(MimeTypes.MarkDown);
        extracted_result.Sections.Add(new(1, result.Content.Trim(), true));

        return extracted_result;

    }

    public async Task<FileContent> DecodeAsync(Stream data, CancellationToken cancellationToken = default)
    {
        //Stream to BinaryData
        using var memoryStream = new MemoryStream();
        await data.CopyToAsync(memoryStream, cancellationToken).ConfigureAwait(true);
        BinaryData binaryData = new(memoryStream.ToArray());

        return await this.DecodeAsync(binaryData, cancellationToken).ConfigureAwait(true);
    }
}
