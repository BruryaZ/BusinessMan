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
    public class FileUploadService(IRepositoryManager repositoryManager) : IService<FileUpload>
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        public async Task<FileUpload?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Files.GetByIdAsync(id);
        }
        public async Task<IEnumerable<FileUpload>> GetListAsync()
        {
            return await _repositoryManager.Files.GetAllAsync();
        }
        public async Task<FileUpload> AddAsync(FileUpload FileUpload)
        {
            return await _repositoryManager.Files.AddAsync(FileUpload);
        }
        public async Task DeleteAsync(FileUpload item)
        {
            await _repositoryManager.Files.DeleteAsync(item);
        }
        public async Task<FileUpload?> UpdateAsync(int id, FileUpload item)
        {
            return await _repositoryManager.Files.UpdateAsync(id, item);
        }
    }
}
