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

namespace BusinessMan.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : Controller
    {
        private readonly IService<FileDto> _fileService;
        private readonly IMapper _mapper;

        public FileUploadController(IService<FileDto> fileService, IMapper mapper)
        {
            _fileService = fileService;
            _mapper = mapper;
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
            if (fileUpload.Length > 50 * 1024 * 1024) // 50MB
            {
                return BadRequest("גודל הקובץ חורג מהמגבלה המותרת.");
            }

            // בדיקת סוג הקובץ
            var allowedExtensions = new[] { ".jpg", ".png", ".pdf", ".docx", ".txt" };
            var fileExtension = Path.GetExtension(fileUpload.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("סוג הקובץ אינו נתמך.");
            }

            // TODO: Save file to AWS S3.

            // שלב 1: שמירה זמנית (או ישירות ל־S3)
            var fileName = fileUpload.Name;//TODO:: Path.GetFileName(fileUpload.FileName);
            var filePath = fileExtension;//TODO:: Path.Combine(_env.WebRootPath, "uploads", Guid.NewGuid() + fileName);

            // יצירת קובץ חדש כדי שמידע כבד ולא רלוונטי לא ישמר במסד הנתונים ולא יעבור בין שכבות האפליקציה ללא צורך
            // שלב 2: יצירת DTO "רזה" להעברה לשירות
            var fileDto = new FileDto
            {
                FileName = fileName + fileExtension,
                Size = fileUpload.Length,
                UploadDate = DateTime.UtcNow,
                FilePath = fileName + fileExtension,
                FileContent = fileUpload,
            };
            Console.WriteLine(fileDto + " " + fileUpload);
            var createdFile = await _fileService.AddAsync(fileDto);

            return Ok("ההעלאה בוצעה בהצלחה");
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