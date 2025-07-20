using Amazon.S3;
using AutoMapper;
using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using BusinessMan.Service;
using BusinessMan.Service.OperationsOnFiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using ConfirmInvoiceRequest = BusinessMan.Core.DTO_s.ConfirmInvoiceRequest;

namespace BusinessMan.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileUploadController : Controller
    {
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IInvoiceService _invoiceService;

        public FileUploadController(IFileService fileService, IMapper mapper, IAmazonS3 amazonS3, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IInvoiceService invoiceService)
        {
            _fileService = fileService;
            _mapper = mapper;
            _s3Client = amazonS3;
            _configuration = configuration;
            _bucketName = configuration["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName");
            _httpContextAccessor = httpContextAccessor;
            _invoiceService = invoiceService;
        }

        // GET: api/<FileUploadController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileDto>>> GetAsync()
        {
            var files = await _fileService.GetListAsync();
            var filesDto = _mapper.Map<IEnumerable<FileDto>>(files);
            return Ok(filesDto);
        }

        // GET api/<FileUploadController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FileDto>> GetAsync(int id)
        {
            var file = await _fileService.GetByIdAsync(id);
            if (file == null)
                return NotFound();

            var fileDto = _mapper.Map<FileDto>(file);
            return Ok(fileDto);
        }

        // POST api/<FileUploadController>
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile fileUpload, [FromQuery] bool analyzeOnly = false)
        {
            if (fileUpload == null || fileUpload.Length == 0)
                return BadRequest("לא נבחר קובץ.");

            if (fileUpload.Length > 50 * 1024 * 1024)
                return BadRequest("גודל הקובץ חורג מהמגבלה המותרת.");

            var allowedExtensions = new[] { ".jpg", ".png", ".pdf", ".docx", ".txt", ".xlsx" };
            var fileExtension = Path.GetExtension(fileUpload.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("סוג הקובץ אינו נתמך.");

            var fileName = Path.GetFileNameWithoutExtension(fileUpload.FileName);
            var key = $"uploads/{Guid.NewGuid()}_{fileName}{fileExtension}";

            try
            {
                using var stream = fileUpload.OpenReadStream();

                var uploadRequest = new Amazon.S3.Transfer.TransferUtilityUploadRequest
                {
                    InputStream = stream,
                    BucketName = _bucketName,
                    Key = key,
                    ContentType = fileUpload.ContentType,
                    CannedACL = S3CannedACL.BucketOwnerFullControl
                };

                var transferUtility = new Amazon.S3.Transfer.TransferUtility(_s3Client);
                await transferUtility.UploadAsync(uploadRequest);

                string fileUrl = $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{key}";

                Invoice analyzedInvoice = null;
                if (analyzeOnly)
                {
                    // ניתוח הקובץ ללא שמירה
                    var fileDtoForAnalysis = new FileDto
                    {
                        FileName = $"{fileName}{fileExtension}",
                        Size = fileUpload.Length,
                        UploadDate = DateTime.UtcNow,
                        FilePath = fileUrl,
                        FileContent = fileUpload,
                        BusinessId = 0,
                        UserId = 0
                    };

                    var reader = new ReadFileContent(_configuration);
                    analyzedInvoice = await reader.FileAnalysis(fileDtoForAnalysis);

                    if (analyzedInvoice != null)
                    {
                        var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
                        if (user != null)
                        {
                            analyzedInvoice.BusinessId = user.BusinessId;
                            analyzedInvoice.UserId = user.Id;
                        }
                    }
                }
                else
                {
                    // שמירת הקובץ רק במסד הנתונים (ללא ניתוח)
                    var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
                    var fileDto = new FileDto
                    {
                        FileName = $"{fileName}{fileExtension}",
                        FilePath = fileUrl,
                        Size = fileUpload.Length,
                        UploadDate = DateTime.UtcNow,
                        BusinessId = user?.BusinessId ?? 0,
                        UserId = user?.Id ?? 0
                    };

                    await _fileService.AddAsync(fileDto, false);
                }

                return Ok(new
                {
                    message = analyzeOnly
                        ? "הקובץ הועלה ונותח. בדוק את הנתונים ואשר לשמירה."
                        : "הקובץ הועלה בהצלחה.",
                    fileUrl,
                    fileName = $"{fileName}{fileExtension}",
                    fileSize = fileUpload.Length,
                    analyzedInvoice = analyzedInvoice // יוחזר רק אם analyzeOnly=true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"אירעה שגיאה בהעלאה: {ex.Message}");
            }
        }

        // POST api/FileUpload/confirm-and-save
        [HttpPost("confirm-and-save")]
        public async Task<IActionResult> ConfirmAndSaveInvoice([FromBody] ConfirmInvoiceRequest request)
        {
            if (request == null || request.Invoice == null || string.IsNullOrEmpty(request.FileUrl))
                return BadRequest("נתונים חסרים לאישור.");

            var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
            if (user == null)
                return Unauthorized();

            try
            {
                // השמת שדות משתמש ועסק
                var invoice = request.Invoice;
                invoice.BusinessId = user.BusinessId;
                invoice.UserId = user.Id;
                invoice.CreatedAt = DateTime.UtcNow;
                invoice.UpdatedAt = DateTime.UtcNow;
                invoice.CreatedBy = $"{user.FirstName} {user.LastName}";
                invoice.UpdatedBy = $"{user.FirstName} {user.LastName}";

                // שמירת החשבונית במסד
                await _invoiceService.AddAsync(invoice);

                // יצירת FileDto לשמירה במסד
                var fileDto = new FileDto
                {
                    FileName = request.FileName,
                    FilePath = request.FileUrl,
                    Size = request.FileSize,
                    UploadDate = DateTime.UtcNow,
                    BusinessId = user.BusinessId ?? 0,
                    UserId = user.Id
                };

                // שמירת פרטי הקובץ במסד
                await _fileService.AddAsync(fileDto, false); // false כי כבר ניתחנו

                return Ok(new { message = "החשבונית והקובץ נשמרו בהצלחה." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשמירת הנתונים: {ex.Message}");
            }
        }

        // POST api/FileUpload/save-file-only
        [HttpPost("save-file-only")]
        public async Task<IActionResult> SaveFileOnly([FromBody] SaveFileRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.FileUrl) || string.IsNullOrEmpty(request.FileName))
                return BadRequest("נתונים חסרים לשמירת הקובץ.");

            var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
            if (user == null)
                return Unauthorized();

            try
            {
                var fileDto = new FileDto
                {
                    FileName = request.FileName,
                    FilePath = request.FileUrl,
                    Size = request.FileSize,
                    UploadDate = DateTime.UtcNow,
                    BusinessId = user.BusinessId ?? 0,
                    UserId = user.Id
                };

                await _fileService.AddAsync(fileDto, false);

                return Ok(new { message = "הקובץ נשמר בהצלחה ללא ניתוח." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשמירת הקובץ: {ex.Message}");
            }
        }
        // POST api/FileUpload/confirm-invoice
        [HttpPost("confirm-invoice")]
        public async Task<IActionResult> ConfirmInvoice([FromBody] ConfirmInvoiceRequest request)
        {
            if (request == null || request.Invoice == null || string.IsNullOrEmpty(request.FileUrl))
                return BadRequest("נתונים חסרים לאישור.");

            var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
            if (user == null)
                return Unauthorized();

            // השמת שדות משתמש בעסק
            var invoice = request.Invoice;
            invoice.BusinessId = user.BusinessId;
            invoice.UserId = user.Id;
            invoice.CreatedAt = DateTime.UtcNow;
            invoice.UpdatedAt = DateTime.UtcNow;
            invoice.CreatedBy = $"{user.FirstName} {user.LastName}";
            invoice.UpdatedBy = $"{user.FirstName} {user.LastName}";

            // שמירת החשבונית במסד
            await _invoiceService.AddAsync(invoice);

            // יצירת FileDto לשמירה במסד
            var fileDto = new FileDto
            {
                FileName = request.FileName,
                FilePath = request.FileUrl,
                Size = request.FileSize,
                UploadDate = DateTime.UtcNow,
                BusinessId = user.BusinessId ?? 0,
                UserId = user.Id
            };

            // שמירת פרטי הקובץ במסד
            await _fileService.AddAsync(fileDto, true);

            return Ok(new { message = "החשבונית והקובץ נשמרו בהצלחה." });
        }

        // PUT api/<FileUploadController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FileDto>> PutAsync(int id, [FromForm] FileDto fileUpload)
        {
            var updatedFile = await _fileService.UpdateAsync(id, fileUpload);
            if (updatedFile == null)
            {
                return NotFound();
            }

            // שמירת הקובץ במערכת (למשל, במערכת הקבצים)
            var filePath = Path.Combine("path_to_storage", fileUpload.FileName);
            // TODO: Save file at AWS S3.
            return Ok(updatedFile);
        }

        // DELETE api/<FileUploadController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var file = await _fileService.GetByIdAsync(id);
            if (file is null)
            {
                return NotFound();
            }
            await _fileService.DeleteAsync(file);

            // מחיקת הקובץ מהמערכת (למשל, ממערכת הקבצים)
            var filePath = Path.Combine("path_to_storage", file.FileName);
            // TODO: Save file to AWS S3.

            return NoContent();
        }

        // הורדת כל הקבצים של המשתמש לזיפ
        [HttpGet("my-files-download-zip")]
        public async Task<IActionResult> DownloadAllMyFilesAsZip()
        {
            var businessIdClaim = User?.FindFirst("business_id")?.Value;
            if (string.IsNullOrEmpty(businessIdClaim))
                return Unauthorized("העסק לא מזוהה.");

            int businessId = int.Parse(businessIdClaim);

            var allFiles = await _fileService.GetListAsync();
            var myFiles = allFiles.Where(f => f.BusinessId == businessId);

            using var memoryStream = new MemoryStream();
            using (var archive = new System.IO.Compression.ZipArchive(memoryStream, System.IO.Compression.ZipArchiveMode.Create, true))
            {
                foreach (var file in myFiles)
                {
                    var request = new Amazon.S3.Model.GetObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = ExtractKeyFromUrl(file.FilePath)
                    };

                    using var response = await _s3Client.GetObjectAsync(request);
                    using var responseStream = response.ResponseStream;
                    var entry = archive.CreateEntry(file.FileName, System.IO.Compression.CompressionLevel.Fastest);

                    using var entryStream = entry.Open();
                    await responseStream.CopyToAsync(entryStream);
                }
            }

            memoryStream.Position = 0;
            return File(memoryStream.ToArray(), "application/zip", "my-files.zip");
        }

        // GET api/FileUpload/download-file/{id}
        [HttpGet("download-file/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var file = await _fileService.GetByIdAsync(id);
            if (file == null)
                return NotFound("הקובץ לא נמצא.");

            // הוצאת המפתח (Key) מתוך כתובת ה-URL של הקובץ ב-S3
            var key = ExtractKeyFromUrl(file.FilePath);

            try
            {
                var request = new Amazon.S3.Model.GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                using var response = await _s3Client.GetObjectAsync(request);
                using var responseStream = response.ResponseStream;

                // קריאה לזרם התגובה לזיכרון
                using var memoryStream = new MemoryStream();
                await responseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                // החזרת הקובץ עם סוג התוכן המקורי והשם לשמירה
                return File(memoryStream.ToArray(), response.Headers.ContentType, file.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בהורדת הקובץ: {ex.Message}");
            }
        }

        [HttpGet("my-files")]
        public async Task<IActionResult> GetMyFiles()
        {
            var businessIdClaim = User?.FindFirst("business_id")?.Value;
            if (string.IsNullOrEmpty(businessIdClaim))
                return Unauthorized("העסק לא מזוהה.");
            int businessId = int.Parse(businessIdClaim);
            var allFiles = await _fileService.GetListAsync();
            var myFiles = allFiles.Where(f => f.BusinessId == businessId);
            return Ok(myFiles);
        }
        private string ExtractKeyFromUrl(string url)
        {
            // מניח שה־Key מתחיל אחרי amazonaws.com/
            var uri = new Uri(url);
            return uri.AbsolutePath.TrimStart('/');
        }
    }
}