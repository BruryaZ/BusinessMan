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
            optionsBuilder.UseNpgsql("postgresql://postgres:mnVEUeJjwMbLclwATfTYVZVWytPctAKf@caboose.proxy.rlwy.net:58725/railway");

            return new DataContext(optionsBuilder.Options);
        }
    }
}