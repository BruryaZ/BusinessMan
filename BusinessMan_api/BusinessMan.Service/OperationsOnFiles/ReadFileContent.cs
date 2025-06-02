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
using Microsoft.Extensions.Configuration;
using Amazon.S3;
using Amazon.S3.Model;
using BusinessMan.Core.BasicModels;

namespace BusinessMan.Service.OperationsOnFiles
{
    public class ReadFileContent(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;

        public static async Task<string> Read(FileDto fileUpload)
        {
            var fileExtension = Path.GetExtension(fileUpload.FileName).ToLower();

            Stream stream;

            if (fileUpload.FileContent != null)
            {
                // הקובץ הגיע מהקליינט (בזיכרון)
                stream = new MemoryStream();
                using var inputStream = fileUpload.FileContent.OpenReadStream();
                await inputStream.CopyToAsync(stream);
                stream.Position = 0;
            }
            else if (!string.IsNullOrEmpty(fileUpload.FilePath) && fileUpload.FilePath.Contains("s3"))
            {
                // הקובץ שמור ב-S3 - נשלוף אותו
                var s3Client = new AmazonS3Client();
                var bucketName = "businessfiles235";
                var key = GetS3KeyFromUrl(fileUpload.FilePath);

                var getRequest = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = key
                };

                using var response = await s3Client.GetObjectAsync(getRequest);
                stream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(stream);
                stream.Position = 0;
            }
            else
            {
                throw new InvalidOperationException("אין קובץ זמין לעיבוד - לא נמצא תוכן בקובץ ולא כתובת S3.");
            }

            return await HandleStreamByExtension(fileExtension, stream, fileUpload);
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

            string invoiceText = await ReadFileContent.Read(file);

            var result = await service.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
            {
                Model = Models.Gpt_4o_mini,
                Messages = new List<ChatMessage>
    {
        ChatMessage.FromSystem("אתה עוזר לנתח חשבוניות ולהחזיר תוצאה כ־JSON לפי מבנה קבוע."),
        ChatMessage.FromUser(
    @$"הנה תוכן חשבונית:

{invoiceText}

החזר לי JSON מתאים למחלקה C# בשם Invoice. הנה מבנה המחלקה:
{{
  ""AmountDebit"": <סכום החובה>,
  ""AmountCredit"": <סכום הזכות>,
  ""InvoiceDate"": ""<תאריך החשבונית>"",
  ""Status"": 1,
  ""Notes"": ""נותח ע״י GPT"",
  ""CreatedBy"": ""gpt"",
  ""UpdatedBy"": ""gpt"",
  ""UserId"": null,
  ""BusinessId"": null,
  ""Type"": ""<מספר של enum>"" // אחד מהערכים: Income = 0, Expense = 1, AssetIncrease = 2, AssetDecrease = 3, LiabilityIncrease = 4, LiabilityDecrease = 5, EquityIncrease = 6, EquityDecrease = 7
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
                // הוספת הסכומים לעסק הרלוונטי

                return invoice;
            }
            else
            {
                Console.WriteLine("שגיאה: " + result.Error?.Message);
                return null;
            }
        }
        private static string GetS3KeyFromUrl(string url)
        {
            // לדוגמה, מתוך URL בסגנון: https://s3.amazonaws.com/your-bucket-name/invoices/filename.pdf
            var uri = new Uri(url);
            return uri.AbsolutePath.TrimStart('/').Split('/', 2).Last(); // "invoices/filename.pdf"
        }

        private static async Task<string> HandleStreamByExtension(string extension, Stream stream, FileDto file)
        {
            return extension switch
            {
                ".pdf" => await ReadPdfContent(stream),
                ".txt" => await new StreamReader(stream).ReadToEndAsync(),
                ".jpg" or ".png" => await ReadImageContent(stream, file),
                ".docx" => await ReadDocxContent(stream),
                ".xlsx" => await ReadExcelContent(stream),
                _ => "סוג הקובץ אינו נתמך לקריאה."
            };
        }
    }
}