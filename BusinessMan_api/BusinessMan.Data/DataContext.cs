using BusinessMan.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace BusinessMan.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // TODO cahnge the connection string
            optionsBuilder.UseNpgsql("Host=db.jzhpcydzzjymiujlfaxt.supabase.co;Database=postgres;Username=postgres;Password=b214958522");
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Example> Examples { get; set; }
        public DbSet<FileDto> UploadedFiles { get; set; }
    }
}