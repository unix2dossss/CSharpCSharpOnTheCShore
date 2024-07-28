using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using w2_l6_ex2.Model;

namespace w2_l6_ex2.Data
{
    internal class StudentDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=StudentsEx.sqlite");
        }

        public DbSet<Student> Students { get; set; }
    }
}
