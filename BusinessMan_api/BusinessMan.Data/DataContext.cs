using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
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
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<FileDto> Files { get; set; }
        public DbSet<Email> EmailList { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; } 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 🗃️ טבלאות
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Invoice>().ToTable("invoices");
            modelBuilder.Entity<Business>().ToTable("businesses");
            modelBuilder.Entity<FileDto>().ToTable("files");
            modelBuilder.Entity<Email>().ToTable("email-list");
            modelBuilder.Entity<JournalEntry>().ToTable("Journal-entries");

            // 📌 קשרים בין Invoice ל-User
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.User)
                .WithMany(u => u.Invoices)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Restrict); // כדי לא למחוק חשבוניות אם משתמש נמחק

            // 📌 קשרים בין Invoice ל-Business
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Business)
                .WithMany(b => b.Invoices)
                .HasForeignKey(i => i.BusinessId)
                .OnDelete(DeleteBehavior.Restrict); // כדי לא למחוק חשבוניות אם עסק נמחק

            // 📌 קשרים בין User ל-Business
            modelBuilder.Entity<User>()
                .HasOne(u => u.Business)
                .WithMany(b => b.Users)
                .HasForeignKey(u => u.BusinessId)
                .OnDelete(DeleteBehavior.Restrict);

            // 💰 טיפוסי Decimal עם דיוק (מתאים גם ל־PostgreSQL וגם ל־SQL Server)
            var decimalProps = new[]
            {
        nameof(Business.CashFlow),
        nameof(Business.CurrentRatio),
        nameof(Business.Expenses),
        nameof(Business.Income),
        nameof(Business.ProfitMargin),
        nameof(Business.QuickRatio),
        nameof(Business.RevenueGrowthRate),
        nameof(Business.TotalAssets),
        nameof(Business.TotalLiabilities)
    };

            foreach (var prop in decimalProps)
            {
                modelBuilder.Entity<Business>()
                    .Property(prop)
                    .HasColumnType("decimal(18,2)");
            }
            modelBuilder.Entity<Invoice>()
    .Property(i => i.AmountDebit)
    .HasColumnType("numeric(18,2)");

            modelBuilder.Entity<Invoice>()
                .Property(i => i.AmountCredit)
                .HasColumnType("numeric(18,2)");
        }

        //        modelBuilder.Entity<User>().ToTable("users");
        //        modelBuilder.Entity<Invoice>().ToTable("invoices");
        //        modelBuilder.Entity<Business>().ToTable("businesses");
        //        modelBuilder.Entity<Example>().ToTable("examples");
        //        modelBuilder.Entity<FileDto>().ToTable("files");
        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.CashFlow)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.CurrentRatio)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.Expenses)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.Income)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.ProfitMargin)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.QuickRatio)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.RevenueGrowthRate)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.TotalAssets)
        //            .HasColumnType("decimal(18,2)");

        //        modelBuilder.Entity<Business>()
        //            .Property(b => b.TotalLiabilities)
        //            .HasColumnType("decimal(18,2)");
        //        modelBuilder.Entity<Invoice>()
        //.HasOne(i => i.User)
        //.WithMany(u => u.Invoices)
        //.HasForeignKey(i => i.UserId)
        //.OnDelete(DeleteBehavior.Restrict); // או DeleteBehavior.NoAction

        //        modelBuilder.Entity<Invoice>()
        //            .HasOne(i => i.Business)
        //            .WithMany(b => b.Invoices)
        //            .HasForeignKey(i => i.BusinessId)
        //            .OnDelete(DeleteBehavior.Restrict); // או DeleteBehavior.NoAction
    }
}