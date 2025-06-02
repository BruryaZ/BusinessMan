using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Repositories
{
    public interface IRepositoryManager
    {
        IRepository<User> User { get; }
        IRepository<Invoice> Invoice { get; }
        IRepository<Business> Business { get; }
        IRepository<FileDto> Files { get; }
        IRepository<Email>? EmailList { get; }
        IRepository<JournalEntry> JournalEntry { get; }
        Task<Business> GetBusinessWithUsersAsync(int id);
        Task SaveAsync();
    }
}