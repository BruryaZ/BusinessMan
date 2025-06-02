using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Extentions;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using BusinessMan.Service.OperationsOnFiles;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static OpenAI.ObjectModels.StaticValues.AudioStatics;

namespace BusinessMan.Service
{
    public class FileUploadService : IService<FileDto>
    {
        private ReadFileContent readFileContent;
        private readonly IRepositoryManager _repositoryManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IInvoiceService _invoiceService;

        public FileUploadService(IRepositoryManager repositoryManager, ReadFileContent readFileContent, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IInvoiceService invoiceService)
        {
            _repositoryManager = repositoryManager;
            this.readFileContent = readFileContent;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _invoiceService = invoiceService;
        }

        public async Task<FileDto?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Files.GetByIdAsync(id);
        }

        public async Task<IEnumerable<FileDto>> GetListAsync()
        {
            return await _repositoryManager.Files.GetAllAsync();
        }

        public async Task<FileDto> AddAsync(FileDto fileUpload)
        {
            // ניתוח הקובץ
            var invoiceToAdd = await readFileContent.FileAnalysis(fileUpload);

            // טיפול נכון בתאריכים
            invoiceToAdd.InvoiceDate = ExtentionsFunctions.ForceUtc(invoiceToAdd.InvoiceDate);
            invoiceToAdd.CreatedAt = ExtentionsFunctions.ForceUtc(invoiceToAdd.CreatedAt);
            invoiceToAdd.UpdatedAt = DateTime.UtcNow;
            invoiceToAdd.InvoicePath = fileUpload.FilePath;

            // הגדרת המידע של מי שיצר את החשבונית
            var user = _httpContextAccessor.HttpContext.Items["CurrentUser"] as User;
            if (user != null)
            {
                invoiceToAdd.User = user;
                invoiceToAdd.UserId = user.Id;
                invoiceToAdd.BusinessId = user.BusinessId;
                invoiceToAdd.CreatedBy = user.FirstName + " " + user.LastName;
                invoiceToAdd.UpdatedBy = user.FirstName + " " + user.LastName;
            }

            await _repositoryManager.Files.AddAsync(fileUpload);
            await _invoiceService.AddAsync(invoiceToAdd);
            await _repositoryManager.SaveAsync();

            return fileUpload;
        }

        public async Task DeleteAsync(FileDto item)
        {
            await _repositoryManager.Files.DeleteAsync(item);
            await _repositoryManager.SaveAsync();
        }

        public async Task<FileDto?> UpdateAsync(int id, FileDto item)
        {
            var updatedFile = await _repositoryManager.Files.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync();
            return updatedFile;
        }
    }
}
