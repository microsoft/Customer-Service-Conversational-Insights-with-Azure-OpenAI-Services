using Microsoft.KernelMemory.Pipeline;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net.Mime;
using Microsoft.Maui.Graphics;
using Microsoft.Maui.Graphics.Skia;


namespace Microsoft.GS.DPS.Images
{
    public class FileThumbnailService
    {
        public static byte[] GetThumbnail(string contentType)
        {
            string file_Extension = "";
            // Based on Content Type
            if (contentType.StartsWith(MimeTypes.ImageJpeg, StringComparison.OrdinalIgnoreCase) ||
                contentType.StartsWith(MimeTypes.ImagePng, StringComparison.OrdinalIgnoreCase))
            {
                file_Extension = "IMG";
            }

            // Pdf File
            if (contentType.StartsWith(MimeTypes.Pdf, StringComparison.OrdinalIgnoreCase))
            {
                //var thumbNailByte = PDFThumbnailService.GetThumbnail(documentStream);
                file_Extension = "PDF";
            }

            // Office File - Excel
            if (contentType.StartsWith(MimeTypes.MsExcelX, StringComparison.OrdinalIgnoreCase)||
                contentType.StartsWith(MimeTypes.MsExcel, StringComparison.OrdinalIgnoreCase)
                )
            {
                file_Extension = "XLS";
            }

            // Office File - PowerPoint
            if (contentType.StartsWith(MimeTypes.MsPowerPointX, StringComparison.OrdinalIgnoreCase)||
                contentType.StartsWith(MimeTypes.MsPowerPoint, StringComparison.OrdinalIgnoreCase))
            {
                file_Extension = "PPT";
            }

            // Office File - Word
            if (contentType.StartsWith(MimeTypes.MsWordX, StringComparison.OrdinalIgnoreCase)||
                contentType.StartsWith(MimeTypes.MsWord, StringComparison.OrdinalIgnoreCase))
            {
                file_Extension = "DOC";
            }

            //Create Png image with drawing Text 'PDF' as a thumbnail.
            using (var bitmapExportContext = new SkiaBitmapExportContext(100, 100, 1.0f, disposeBitmap: true))
            {

                ICanvas canvas = bitmapExportContext.Canvas;
                canvas.FillColor = Colors.White;
                canvas.FillRectangle(0, 0, 100, 100);

                var fontSize = 30;
                if (file_Extension.Length == 4) fontSize = 25;

                var font = new Font("Arial", FontWeights.Bold, FontStyleType.Normal);

                canvas.Font = font;
                canvas.FontSize = fontSize;
                canvas.FillColor = Colors.Black;
                canvas.DrawString(file_Extension, 10, 60, HorizontalAlignment.Left);

                using (var stream = new MemoryStream())
                {
                    bitmapExportContext.WriteToStream(stream);
                    return stream.ToArray();
                }
            }
        }
    }
}