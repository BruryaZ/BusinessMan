using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3;

namespace BusinessMan.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileUploadController : Controller
    {
        private readonly IService<FileDto> _fileService;
        private readonly IMapper _mapper;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly IConfiguration _configuration;

        public FileUploadController(IService<FileDto> fileService, IMapper mapper, IAmazonS3 amazonS3, IConfiguration configuration)
        {
            _fileService = fileService;
            _mapper = mapper;
            _s3Client = amazonS3;
            _configuration = configuration;
            _bucketName = configuration["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName");
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
        public async Task<IActionResult> Upload(IFormFile fileUpload)
        {
            if (fileUpload == null || fileUpload.Length == 0)
                return BadRequest("לא נבחר קובץ.");

            if (fileUpload.Length > 50 * 1024 * 1024) // מגבלת 50MB
                return BadRequest("גודל הקובץ חורג מהמגבלה המותרת.");

            // בדיקת סוג קובץ מותר
            var allowedExtensions = new[] { ".jpg", ".png", ".pdf", ".docx", ".txt" };
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

                var fileDto = new FileDto
                {
                    FileName = $"{fileName}{fileExtension}",
                    Size = fileUpload.Length,
                    UploadDate = DateTime.UtcNow,
                    FilePath = fileUrl,
                    FileContent = fileUpload
                };

                var createdFile = await _fileService.AddAsync(fileDto);

                return Ok(new { message = "ההעלאה הצליחה", fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"אירעה שגיאה בהעלאת הקובץ: {ex.Message}");
            }
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
    }
}
