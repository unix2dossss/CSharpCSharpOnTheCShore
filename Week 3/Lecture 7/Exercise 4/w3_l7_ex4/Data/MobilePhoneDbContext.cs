using Microsoft.EntityFrameworkCore;
using w3_l7_ex4.Model;

namespace w3_l7_ex4.Data
{
    public class MobilePhoneDbContext : DbContext
    {
        public MobilePhoneDbContext(DbContextOptions<MobilePhoneDbContext> options) : base(options) { }
        public DbSet<Phone> Phones { get; set; }
    }
}
