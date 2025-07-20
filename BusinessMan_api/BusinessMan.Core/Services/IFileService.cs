using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Services
{
    public interface IFileService
    {
        Task<IEnumerable<FileDto>> GetListAsync();
        Task<FileDto?> GetByIdAsync(int id);
        Task<FileDto> AddAsync(FileDto item, bool analyzeAndSave);
        Task<FileDto?> UpdateAsync(int id, FileDto item);
        Task DeleteAsync(FileDto item);
    }
}
