using Amazon.Runtime.Internal.Transform;
using Microsoft.AspNetCore.Mvc;
using Microsoft.GS.DPS.API.UserInterface;
using Microsoft.GS.DPS.Images;
using Microsoft.GS.DPS.Model.UserInterface;
using Microsoft.GS.DPS.Storage.Document;
using Microsoft.KernelMemory;
using System.Text;

namespace Microsoft.GS.DPSHost.API
{
    public class UserInterface
    {
        private static Dictionary<string, byte[]> thumbnails = new Dictionary<string, byte[]>();

        // Static method to register APIs
        public static void AddAPIs(WebApplication app)
        {
            ///<summary>
            ///Get Thumbnail image by File's content type
            ///It renders image by Content Type
            ///</summary>
            ///<param name="contentType">Content Type</param>
            ///<returns>The thumbnail image</returns>
            app.MapGet("/Documents/{DocumentId}/Thumbnail", async (HttpContext ctx,
                                                             DocumentRepository documentRepository,
                                                             string DocumentId) =>
            {
                //Get Document
                var document = await documentRepository.FindByDocumentIdAsync(DocumentId);

                //Check if the thumbnail is already in the cache
                if (thumbnails.ContainsKey(document.MimeType))
                {
                    return Results.File(thumbnails[document.MimeType], "image/png");
                }
                else
                {
                    //Get the thumbnail from the ImageService
                    var thumbnailImage = FileThumbnailService.GetThumbnail(document.MimeType);
                    if (thumbnailImage == null)
                    {
                        return Results.NotFound();
                    }
                    else
                    {
                        //Add the thumbnail to the cache
                        thumbnails.Add(document.MimeType, thumbnailImage);
                        return Results.File(thumbnailImage, "image/png");
                    }
                }
            }
            )
            .DisableAntiforgery(); ;

            app.MapGet("/Documents/{documentId}/{fileName}", async (HttpContext ctx,
                                                                    string documentId,
                                                                    string fileName,
                                                                    MemoryWebClient kmClient,
                                                                    bool? embed) =>
            {
                StreamableFileContent fileContent = await kmClient.ExportFileAsync(documentId, fileName);

                var fileStream = await fileContent.GetStreamAsync();
                if (fileStream == null)
                {
                    return Results.NotFound();
                }

                // Determine the Content-Disposition header based on the embed parameter
                string contentDisposition = embed.HasValue && embed.Value ? "inline" : "attachment";
                ctx.Response.Headers["Content-Disposition"] = $"{contentDisposition}; filename=\"{SanitizeHeaderValue(fileContent.FileName)}\"";
                ctx.Response.Headers["Content-Type"] = fileContent.FileType;
                ctx.Response.Headers["Last-Modified"] = fileContent.LastWrite.ToString("R");

                // Write the file stream to the response
                ctx.Response.ContentLength = fileStream.Length;
                await fileStream.CopyToAsync(ctx.Response.Body);

                return Results.Ok();
            })
            .DisableAntiforgery();



            app.MapPost("/Documents/GetDocuments", async (HttpContext ctx,
                                                          Documents documents,
                                                          PagingRequestWithSearchValidator pagingRequestWithSearchValidator,
                                                          [FromBody] PagingRequestWithSearch pagingRequestWithSearch) =>
            {
                var validateResult = pagingRequestWithSearchValidator.Validate(pagingRequestWithSearch);
                if (!validateResult.IsValid) return Results.BadRequest(validateResult);

                var querySet = await documents.GetDocumentsWithQuery(pagingRequestWithSearch.PageNumber,
                                                                     pagingRequestWithSearch.PageSize,
                                                                     pagingRequestWithSearch.Keyword,
                                                                     pagingRequestWithSearch.Tags,
                                                                     pagingRequestWithSearch.StartDate,
                                                                     pagingRequestWithSearch.EndDate);
                return Results.Ok<DocumentQuerySet>(querySet);
            })
            .DisableAntiforgery(); ;


            app.MapGet("/Documents/{DocumentId}", async (HttpContext ctx,
                                                        Documents documents,
                                                        string DocumentId) =>
            {
                DPS.Storage.Document.Entities.Document result = await documents.GetDocument(DocumentId);

                if (result == null)
                {
                    return Results.NotFound();
                }
                else
                {
                    return Results.Ok(result);
                }
            }
            )
            .DisableAntiforgery();
        }
        private static string SanitizeHeaderValue(string value)
        {
            // Encode the value using RFC 5987 encoding
            var bytes = Encoding.UTF8.GetBytes(value);
            var encodedValue = new StringBuilder();
            foreach (var b in bytes)
            {
                if ((b >= 0x30 && b <= 0x39) || // 0-9
                    (b >= 0x41 && b <= 0x5A) || // A-Z
                    (b >= 0x61 && b <= 0x7A) || // a-z
                    b == 0x2D || b == 0x2E || b == 0x5F || b == 0x7E) // - . _ ~
                {
                    encodedValue.Append((char)b);
                }
                else
                {
                    encodedValue.AppendFormat("%{0:X2}", b);
                }
            }
            return encodedValue.ToString();
        }
    } 
}


