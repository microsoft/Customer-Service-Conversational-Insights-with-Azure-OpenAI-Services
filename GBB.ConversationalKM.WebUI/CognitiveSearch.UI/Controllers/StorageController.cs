// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using Azure.Storage.Blobs;
using Azure.Storage;
using Azure.Storage.Blobs.Models;

namespace CognitiveSearch.UI.Controllers
{
    public class StorageController : Controller
    {
        private IConfiguration _configuration { get; set; }
        private DocumentSearchClient _docSearch { get; set; }

        public StorageController(IConfiguration configuration)
        {
            _configuration = configuration;
            _docSearch = new DocumentSearchClient(configuration);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload()
        {
            if (Request.Form.Files.Any())
            {
                var container = GetStorageContainer(0);

                foreach (var formFile in Request.Form.Files)
                {
                    if (formFile.Length > 0)
                    {
                        var blob = container.GetBlobClient(formFile.FileName);
                        var blobHttpHeader = new BlobHttpHeaders();
                        blobHttpHeader.ContentType = formFile.ContentType;
                        await blob.UploadAsync(formFile.OpenReadStream(), blobHttpHeader);
                    }
                }
            }

            await _docSearch.RunIndexer();

            return new JsonResult("ok");
        }

        /// <summary>
        ///  Returns the requested document with an 'inline' content disposition header.
        ///  This hints to a browser to show the file instead of downloading it.
        /// </summary>
        /// <param name="storageIndex">The storage connection string index.</param>
        /// <param name="fileName">The storage blob filename.</param>
        /// <param name="mimeType">The expected mime content type.</param>
        /// <returns>The file data with inline disposition header.</returns>
        [HttpGet("preview/{storageIndex}/{fileName}/{mimeType}")]
        public async Task<FileContentResult> GetDocumentInline(int storageIndex, string fileName, string mimeType)
        {
            var decodedFilename = HttpUtility.UrlDecode(fileName);
            var container = GetStorageContainer(storageIndex);
            var blob = container.GetBlobClient(decodedFilename);
            using (var ms = new MemoryStream())
            {
                var downlaodInfo = await blob.DownloadAsync();
                await downlaodInfo.Value.Content.CopyToAsync(ms);
                Response.Headers.Add("Content-Disposition", "inline; filename=" + decodedFilename);
                return File(ms.ToArray(), HttpUtility.UrlDecode(mimeType));
            }
        }

        private BlobContainerClient GetStorageContainer(int storageIndex)
        {
            string accountName = _configuration.GetSection("StorageAccountName")?.Value;
            string accountKey = _configuration.GetSection("StorageAccountKey")?.Value;

            var containerKey = "StorageContainerAddress";
            if (storageIndex > 0)
                containerKey += (storageIndex+1).ToString();
            var containerAddress = _configuration.GetSection(containerKey)?.Value.ToLower();

            var container = new BlobContainerClient(new Uri(containerAddress), new StorageSharedKeyCredential(accountName, accountKey));
            return container;
        }
    }
}
