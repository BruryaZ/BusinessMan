using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace BusinessMan.API.Controllers
{
    public class FileUploadController : Controller
    {
        private readonly IService<FileDto> _fileService;

        public FileUploadController(IService<FileDto> fileService)
        {
            _fileService = fileService;
        }

        // GET: api/<FileUploadController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileDto>>> GetAsync()
        {
            var files = await _fileService.GetListAsync();
            return Ok(files);
        }

        // GET api/<FileUploadController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FileDto>> GetAsync(int id)
        {
            var file = await _fileService.GetByIdAsync(id);
            if (file == null)
                return NotFound();
            return Ok(file);
        }

        // POST api/<FileUploadController>
        [HttpPost]
        public async Task<ActionResult<FileDto>> PostAsync([FromForm] FileUpload fileUpload)
        {
            if (fileUpload.FileContent.Length > 50 * 1024 * 1024) // 50MB
            {
                return BadRequest("גודל הקובץ חורג מהמגבלה המותרת.");
            }

            // בדיקת סוג הקובץ
            var allowedExtensions = new[] { ".jpg", ".png", ".pdf", ".docx" };
            var fileExtension = Path.GetExtension(fileUpload.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("סוג הקובץ אינו נתמך.");
            }

            // כאן תוכל להמיר את FileUploadDto ל-FileDto לפני השמירה
            var fileDto = new FileDto
            {
                FileName = fileUpload.FileName,
                // מלא את שאר השדות הנדרשים, כמו FilePath, CreatedAt, וכו'
            };

            var createdFile = await _fileService.AddAsync(fileDto);
            return Ok(createdFile);
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
            return NoContent();
        }
    }
}
