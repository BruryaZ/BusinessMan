using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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
            // User Id=postgres.jzhpcydzzjymiujlfaxt;Password=[YOUR-PASSWORD];Server=aws-0-eu-central-1.pooler.supabase.com;Port=6543;Database=postgres
            // render : optionsBuilder.UseNpgsql("Host=dpg-cvc7k5an91rc73cbo3dg-a;Database=businessman;Username=businessman_user;Password=hzVdhB3mXwqV6vZlOsWulAjFNlo0gYHa");
            // supabase : optionsBuilder.UseNpgsql("Host=db.jzhpcydzzjymiujlfaxt.supabase.co;Database=postgres;Username=postgres;Password=b214958522");
            optionsBuilder.UseNpgsql("User Id=postgres.jzhpcydzzjymiujlfaxt;Password=b214958522;Server=aws-0-eu-central-1.pooler.supabase.com;Port=6543;Database=postgres");
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Example> Examples { get; set; }
        public DbSet<FileDto> UploadedFiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // הגדרת שמות הטבלאות באות קטנה
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Invoice>().ToTable("invoices");
            modelBuilder.Entity<Business>().ToTable("businesses");
            modelBuilder.Entity<Example>().ToTable("examples");
            modelBuilder.Entity<FileDto>().ToTable("uploaded_files");
        }
    }
}