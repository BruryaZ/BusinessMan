using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Data.Repositories
{
    public interface IRepositoryManager
    {
        IRepository<User> User { get; }
        IRepository<Invoice> Invoice { get; }
        IRepository<Business> Business { get; }
        IRepository<Example> Examples { get; }
        IRepository<FileDto> Files { get; }
        Task SaveAsync();
    }
}
