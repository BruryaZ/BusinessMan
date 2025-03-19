using BusinessMan.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessMan.Core.Services;
using Microsoft.EntityFrameworkCore;

namespace BusinessMan.Service
{
    public class EmailService : IEmailService
    {
        private readonly DataContext _context;

        public EmailService(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string emailAddress)
        {
            return await _context.EmailList.AnyAsync(e => e.EmailAddress == emailAddress);
        }
    }
}
