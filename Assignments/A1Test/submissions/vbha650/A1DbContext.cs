using Microsoft.EntityFrameworkCore;
using A1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace A1.Data
{
    public class A1DbContext : DbContext
    {
        public A1DbContext(DbContextOptions<A1DbContext> options) : base(options) { }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Sign> Signs { get; set; }
    }
}
