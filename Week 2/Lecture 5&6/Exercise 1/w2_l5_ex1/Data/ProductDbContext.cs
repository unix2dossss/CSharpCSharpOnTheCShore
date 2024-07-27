using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using w2_l5_ex1.Model;

namespace w2_l5_ex1.Data
{
    internal class ProductDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=ex.sqlite");
        }
        public DbSet<Product> Products { get; set; }
    }
}
