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
            //optionsBuilder.UseNpgsql("postgresql://postgres:mnVEUeJjwMbLclwATfTYVZVWytPctAKf@caboose.proxy.rlwy.net:58725/railway");
            optionsBuilder.UseNpgsql("Host=caboose.proxy.rlwy.net;Port=58725;Username=postgres;Password=mnVEUeJjwMbLclwATfTYVZVWytPctAKf;Database=railway;SSL Mode=Require;Trust Server Certificate=true;Pooling=false;");

            return new DataContext(optionsBuilder.Options);
        }
    }
}