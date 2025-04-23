using OpenAI;
using OpenAI.Managers;
using OpenAI.ObjectModels;
using OpenAI.ObjectModels.RequestModels;
using BusinessMan.Core.DTO_s;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tesseract;
using DocumentFormat.OpenXml.EMMA;
using System.Text.Json;
using BusinessMan.Core.Models;
using Microsoft.Extensions.Configuration;

namespace BusinessMan.Service.OperationsOnFiles
{
    public class ReadFileContent(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;
        public static async Task<string> Read(FileDto fileUpload)
        {
            var fileExtension = System.IO.Path.GetExtension(fileUpload.FileName).ToLower();

            // הנח שיש לך זרם מקור ב- FileDto
            using (var stream = new MemoryStream())
            {
                using var inputStream = fileUpload.FileContent.OpenReadStream();
                await inputStream.CopyToAsync(stream);
                stream.Position = 0; // החזרת המצביע להתחלה

                switch (fileExtension)
                {
                    case ".pdf":
                        return await ReadPdfContent(stream); // הפעלת קריאת PDF

                    case ".txt":
                        using (var reader = new StreamReader(stream))
                        {
                            return await reader.ReadToEndAsync();
                        }

                    case ".jpg":
                    case ".png":
                        return await ReadImageContent(stream, fileUpload); // קריאת טקסט מתמונה

                    case ".docx":
                        return await ReadDocxContent(stream); // קריאה מקובץ Word

                    case ".xlsx":
                        return await ReadExcelContent(stream); // קריאה מקובץ Excel

                    default:
                        return "סוג הקובץ אינו נתמך לקריאה.";
                }
            }
        }

        private static async Task<string> ReadDocxContent(Stream stream)
        {
            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(stream, false))
            {
                StringBuilder text = new StringBuilder();
                Body body = wordDoc.MainDocumentPart.Document.Body;

                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    text.Append(paragraph.InnerText + "\n");
                }

                return text.ToString();
            }
        }

        private static async Task<string> ReadExcelContent(Stream stream)
        {
            using (ExcelPackage package = new ExcelPackage(stream))
            {
                StringBuilder text = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // קבלת הגיליון הראשון

                for (int row = 1; row <= worksheet.Dimension.End.Row; row++)
                {
                    for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                    {
                        text.Append(worksheet.Cells[row, col].Text + "\t"); // הוספת טקסט עם טאב
                    }
                    text.AppendLine(); // מעבר לשורה הבאה
                }

                return text.ToString();
            }
        }

        private static async Task<string> ReadPdfContent(Stream stream)
        {
            StringBuilder text = new StringBuilder();

            using (var pdfDoc = new PdfDocument(new PdfReader(stream)))
            {
                int numberOfPages = pdfDoc.GetNumberOfPages(); // קבלת מספר העמודים

                for (int i = 1; i <= numberOfPages; i++)
                {
                    var page = pdfDoc.GetPage(i);
                    var strategy = new SimpleTextExtractionStrategy();
                    var pageText = PdfTextExtractor.GetTextFromPage(page, strategy);
                    text.Append(pageText);
                }
            }

            return text.ToString();
        }

        private static async Task<string> ReadImageContent(Stream stream, FileDto fileUpload)
        {
            string tempFilePath = Path.GetTempFileName() + Path.GetExtension(fileUpload.FileName);

            using (var fileStream = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write))
            {
                if (fileUpload.FileContent == null)
                    throw new InvalidOperationException("FileContent is null. ודא שהקובץ הועבר כראוי מהקליינט.");

                await stream.CopyToAsync(fileStream);
            }

            return ReadTextFromImage(tempFilePath);
        }

        private static string ReadTextFromImage(string imagePath)
        {
            using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
            {
                using (var img = Pix.LoadFromFile(imagePath))
                {
                    using (var page = engine.Process(img))
                    {
                        return page.GetText();
                    }
                }
            }
        }

        public async Task<Invoice> FileAnalysis(FileDto file)
        {
            var apiKey = _configuration["OpenAI:ApiKey"];
            var service = new OpenAIService(new OpenAiOptions
            {
                ApiKey = apiKey
            });

            // שימי כאן את הטקסט של החשבונית ששלפת מ-PDF
            string invoiceText = await ReadFileContent.Read(file);

            var result = await service.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
            {
                Model = Models.Gpt_4o_mini,
                //Model = Models.Gpt_3_5_Turbo,
                Messages = new List<ChatMessage>
    {
        ChatMessage.FromSystem("אתה עוזר לנתח חשבוניות ולהחזיר תוצאה כ־JSON לפי מבנה קבוע."),
        ChatMessage.FromUser(
            @$"הנה תוכן חשבונית:

{invoiceText}

החזר לי JSON מתאים למחלקה C# בשם Invoice. הנה מבנה המחלקה:
{{
  ""AmountDebit"": ""<סכום החובה>"",
  ""AmountCredit"": ""<סכום הזכות>"",
  ""InvoiceDate"": ""<תאריך החשבונית>"",
  ""Status"": 1,
  ""Notes"": ""נותח ע״י GPT"",
  ""CreatedBy"": ""gpt"",
  ""UpdatedBy"": ""gpt"",
  ""UserId"": null,
  ""BusinessId"": null
}}

החזר את ה-JSON בלבד וללא טקסט נוסף. החזר את התאריך בפורמט yyyy-MM-dd")
    },
                Temperature = 0.2f
            });

            if (result.Successful)
            {
                var json = result.Choices.First().Message.Content;
                Console.WriteLine("JSON שהתקבל:\n" + json);

                // הסרת סימונים ```json ו-``` אם קיימים
                json = json.Trim().Trim('`');
                if (json.StartsWith("json"))
                {
                    json = json.Substring(4).Trim();
                }

                // עכשיו אפשר לעשות Deserialize
                var invoice = JsonSerializer.Deserialize<Invoice>(json);

                Console.WriteLine($"סכום חובה: {invoice.AmountDebit}, סכום זכות: {invoice.AmountCredit}");
                return invoice;
            }
            else
            {
                Console.WriteLine("שגיאה: " + result.Error?.Message);
                return null;
            }
        }
    }
}