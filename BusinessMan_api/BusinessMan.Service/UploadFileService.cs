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
    public class FileDtoService(IRepositoryManager repositoryManager) : IService<FileDto>
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        public async Task<FileDto?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Files.GetByIdAsync(id);
        }
        public async Task<IEnumerable<FileDto>> GetListAsync()
        {
            return await _repositoryManager.Files.GetAllAsync();
        }
        public async Task<FileDto> AddAsync(FileDto FileDto)
        {
            return await _repositoryManager.Files.AddAsync(FileDto);
        }
        public async Task DeleteAsync(FileDto item)
        {
            await _repositoryManager.Files.DeleteAsync(item);
        }
        public async Task<FileDto?> UpdateAsync(int id, FileDto item)
        {
            return await _repositoryManager.Files.UpdateAsync(id, item);
        }
    }
}
