using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using BusinessMan.Service.OperationsOnFiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    public class FileUploadService : IService<FileDto>
    {
        private ReadFileContent readFileContent;
        private readonly IRepositoryManager _repositoryManager;

        public FileUploadService(IRepositoryManager repositoryManager, ReadFileContent readFileContent)
        {
            _repositoryManager = repositoryManager;
            this.readFileContent = readFileContent;
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
            // חילוץ הסכומים וגיבוי הקובץ
            var res = ReadFileContent.FileAnalysis(fileUpload);
            string content = await readFileContent.Read(fileUpload);
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
