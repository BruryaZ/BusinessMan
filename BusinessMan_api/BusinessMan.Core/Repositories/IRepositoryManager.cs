using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
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
        IRepository<Example> Examples { get; }
        IRepository<FileDto> Files { get; }
        IRepository<Email>? EmailList { get; }
        Task<Business> GetBusinessWithUsersAsync(int id);
        Task SaveAsync();
    }
}