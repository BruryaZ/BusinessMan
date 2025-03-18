﻿using BusinessMan.Core.DTO_s;
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
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    // User Id=postgres.jzhpcydzzjymiujlfaxt;Password=[YOUR-PASSWORD];Server=aws-0-eu-central-1.pooler.supabase.com;Port=6543;Database=postgres
        //    // render : optionsBuilder.UseNpgsql("Host=dpg-cvc7k5an91rc73cbo3dg-a;Database=businessman;Username=businessman_user;Password=hzVdhB3mXwqV6vZlOsWulAjFNlo0gYHa");
        //    // supabase : optionsBuilder.UseNpgsql("Host=db.jzhpcydzzjymiujlfaxt.supabase.co;Database=postgres;Username=postgres;Password=b214958522");
        //    optionsBuilder.UseNpgsql("User Id=postgres.jzhpcydzzjymiujlfaxt;Password=b214958522;Server=aws-0-eu-central-1.pooler.supabase.com;Port=6543;Database=postgres");
        //    optionsBuilder.LogTo(message => Debug.WriteLine(message));
        //}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=businessman_db");
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Example> Examples { get; set; }
        public DbSet<FileDto> UploadedFiles { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    // הגדרת שמות הטבלאות באות קטנה
        //    modelBuilder.Entity<User>().ToTable("users");
        //    modelBuilder.Entity<Invoice>().ToTable("invoices");
        //    modelBuilder.Entity<Business>().ToTable("businesses");
        //    modelBuilder.Entity<Example>().ToTable("examples");
        //    modelBuilder.Entity<FileDto>().ToTable("uploaded_files");
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Business>()
                .Property(b => b.CashFlow)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.CurrentRatio)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.Expenses)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.Income)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.ProfitMargin)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.QuickRatio)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.RevenueGrowthRate)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.TotalAssets)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Business>()
                .Property(b => b.TotalLiabilities)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Invoice>()
    .HasOne(i => i.User)
    .WithMany(u => u.Invoices)
    .HasForeignKey(i => i.UserId)
    .OnDelete(DeleteBehavior.Restrict); // או DeleteBehavior.NoAction

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Business)
                .WithMany(b => b.Invoices)
                .HasForeignKey(i => i.BusinessId)
                .OnDelete(DeleteBehavior.Restrict); // או DeleteBehavior.NoAction
        }
    }
}