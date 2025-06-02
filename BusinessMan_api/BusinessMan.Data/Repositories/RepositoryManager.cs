using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Data.Repositories
{
    public class RepositoryManager(DataContext context, IRepository<User> user_r, 
        IRepository<Invoice> invoice_r , IRepository<Business> business_r, IRepository<FileDto> file_r, IRepository<Email> email_r, IRepository<JournalEntry> journal_r) : IRepositoryManager
    {
        private readonly DataContext _dataContext = context;
        public IRepository<User> User => user_r;
        public IRepository<Invoice> Invoice => invoice_r;
        public IRepository<Business> Business => business_r;
        public IRepository<FileDto> Files => file_r;
        public IRepository<Email> EmailList => email_r;
        public IRepository<JournalEntry> JournalEntry => journal_r;
        public async Task<Business> GetBusinessWithUsersAsync(int id)
        {
            return await _dataContext.Businesses
                                     .Include(b => b.Users)
                                     .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
