using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    public class FileUploadService : IService<FileDto>
    {
        private readonly IRepositoryManager _repositoryManager;

        public FileUploadService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
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
            await _repositoryManager.Files.AddAsync(fileUpload);
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
