using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _dataContext;
        public IRepository<User> User { get; }
        public IRepository<Example> Examples { get; }
        public IRepository<Invoice> Invoice { get; }
        public IRepository<Business> Business { get; }
        public IRepository<FileDto> Files { get; }
        public IRepository<Email>? EmailList { get; }

        public RepositoryManager(DataContext context, IRepository<User> users, IRepository<Invoice> invoices, IRepository<Business> business, IRepository<Example> examples, IRepository<FileDto> files, IRepository<Email> emails)
        {
            _dataContext = context;
            User = users;
            Invoice = invoices;
            Examples = examples;
            Business = business;
            Files = files;
            EmailList = emails;
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
