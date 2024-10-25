using Microsoft.GS.DPSHost.AppConfiguration;
using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using Microsoft.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using Microsoft.KernelMemory.Context;
using Microsoft.GS.DPS.Model.KernelMemory;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.GS.DPS.Storage.Document;

using HeyRed.Mime;

namespace Microsoft.GS.DPSHost.API
{
    //Define File Upload and Ask API
    public class KernelMemory
    {
        public static void AddAPIs(WebApplication app)
        {
            //Registration the files
            app.MapPost("/Documents/ImportDocument", async (IFormFile file,
                                                            DPS.API.KernelMemory kernelMemory
                                                            ) =>
            {
                try
                {
                    var fileStream = file.OpenReadStream();
                    //Set Stream Position to 0
                    fileStream.Seek(0, SeekOrigin.Begin);

                    // Verify and set ContentType if empty
                    var contentType = file.ContentType;
                    var fileExtension = Path.GetExtension(file.FileName);

                    if (string.IsNullOrEmpty(contentType))
                    {
                        contentType = MimeTypesMap.GetMimeType(fileExtension);
                    }


                    //Check supported file types
                    var allowedExtensions = new string[] { ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".tif", ".tiff", ".jpg", ".jpeg", ".png", ".bmp", ".txt" };

                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return Results.BadRequest(new DocumentImportedResult() { DocumentId = string.Empty, 
                                                                                 MimeType = contentType,
                                                                                 Summary = $"{fileExtension} file is Unsupported file type" });
                    }

                    var result = await kernelMemory.ImportDocument(fileStream, file.FileName, contentType);

                    //Return HTTP 202 with Location Header
                    //return Results($"/Documents/CheckProcessStatus/{result.DocumentId}", result);
                    // Add Document to the Repository

                    //Refresh the Cache
                    return Results.Ok<DocumentImportedResult>(result);
                }
                catch (IOException ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An error occurred while uploading the document.");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An unexpected error occurred.");
                    throw;
                }

            })
            .DisableAntiforgery();

            app.MapDelete("/Documents/{documentId}", async (string documentId,
                                                            DPS.API.KernelMemory kernelMemory) =>
            {
                try
                {
                    await kernelMemory.DeleteDocument(documentId);
                    return Results.Ok(new DocumentDeletedResult() { IsDeleted = true });
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(new DocumentDeletedResult() { IsDeleted = false });
                }
            })
            .DisableAntiforgery();

            app.MapGet("/Documents/{documentId}/CheckReadyStatus", async (string documentId,
                                                                          MemoryWebClient kmClient) =>
            {
                var result = await kmClient.IsDocumentReadyAsync(documentId);

                return Results.Ok(new DocumentReadyStatusResult() { IsReady = result });
            })
            .DisableAntiforgery();


            app.MapGet("/Documents/{documentId}/CheckProcessStatus/", async (string documentId,
                                                                             MemoryWebClient kmClient) =>
            {
                var status = await kmClient.GetDocumentStatusAsync(documentId);
                if (status == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(status);
            })
            .DisableAntiforgery();

            app.MapPost("/Documents/ImportText", async (string text,
                                                        MemoryWebClient kmClient) =>
            {
                try
                {
                    var documentId = await kmClient.ImportTextAsync(text);

                    return Results.Ok(new DocumentImportedResult() { DocumentId = documentId });
                }
                catch (IOException ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An error occurred while uploading the document.");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An unexpected error occurred.");
                    throw;
                }
            })
            .DisableAntiforgery();

            app.MapPost("/Documents/ImportWebPage", async (string url,
                                                           MemoryWebClient kmClient) =>
            {
                try
                {
                    // Implementation of the file upload
                    var documentId = await kmClient.ImportWebPageAsync(url);
                    return Results.Ok(new DocumentImportedResult() { DocumentId = documentId });
                }
                catch (IOException ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An error occurred while uploading the document.");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log the exception
                    app.Logger.LogError(ex, "An unexpected error occurred.");
                    throw;
                }
            })
            .DisableAntiforgery();

            //Check the status of File Registration Process
            //TODO : Implement the SSE for the status of the document
            app.MapGet("/Documents/CheckStatus/{documentId}", async Task (HttpContext ctx,
                                                                          string documentId,
                                                                          MemoryWebClient kmClient, CancellationToken token) =>
            {
                ctx.Response.Headers.Append(HeaderNames.ContentType, "text/event-stream");

                //Creating While Loop with 10 mins timeout
                var timeout = DateTime.UtcNow.AddMinutes(10);
                var completeFlag = false;

                var status = await kmClient.GetDocumentStatusAsync(documentId);

                while (DateTime.UtcNow < timeout)
                {
                    token.ThrowIfCancellationRequested();

                    //if status is null then return 404 with exit the loop
                    if (status == null)
                    {
                        ctx.Response.StatusCode = 404;
                        return;
                    }

                    if (status.RemainingSteps.Count == 0)
                    {
                        completeFlag = true;
                        break;
                    }
                    var totalSteps = status.Steps.Count;
                    var statusObject = new
                    {
                        progress_percentage = status.CompletedSteps.Count / totalSteps * 100,
                        completed = status.Completed
                    };

                    await ctx.Response.WriteAsync($"{JsonSerializer.Serialize(statusObject)}", cancellationToken: token);
                    await ctx.Response.Body.FlushAsync(token);

                    await Task.Delay(new TimeSpan(0, 0, 5));

                    status = await kmClient.GetDocumentStatusAsync(documentId);
                }

                await ctx.Response.CompleteAsync();
            })
            .DisableAntiforgery();


            app.MapPost("/Documents/Search", async (MemoryWebClient kmClient,
                                                    SearchParameter searchParameter) =>
            {
                var searchResult = await kmClient.SearchAsync(query: searchParameter.query,
                                                              filter: searchParameter.MemoryFilter,
                                                              filters: searchParameter.MemoryFilters,
                                                              minRelevance: searchParameter.minRelevance,
                                                              limit: searchParameter.limit,
                                                              context: searchParameter.Context);

                if (searchResult == null)
                {
                    return Results.NoContent();
                }

                return Results.Ok(searchResult);
            })
            .DisableAntiforgery();


            app.MapPost("/Documents/Ask", async (MemoryWebClient kmClient,
                                                 AskParameter askParameter) =>

            {
                //create Memory Filter
                var memoryFilters = new List<MemoryFilter>();
                askParameter.documents.ToList().ForEach(docId => memoryFilters.Add(new MemoryFilter().ByDocument(docId)));

                var answer = await kmClient.AskAsync(question: askParameter.question,
                                                     filters: memoryFilters);
                if (answer == null)
                {
                    return Results.NoContent();
                }
                return Results.Ok(answer);
            })
            .DisableAntiforgery();
        }
    }
}
