using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BusinessMan.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            optionsBuilder.UseNpgsql("Host=db.fxmuilefdjrimtcujyfu.supabase.co;Database=postgres;Username=postgres;Password=b214958522;SSL Mode=Require;Trust Server Certificate=true");

            return new DataContext(optionsBuilder.Options);
        }
    }
}