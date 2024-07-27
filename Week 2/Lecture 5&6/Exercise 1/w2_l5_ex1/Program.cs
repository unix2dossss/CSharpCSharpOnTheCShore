using w2_l5_ex1.Data;
using w2_l5_ex1.Model;

namespace w2_l5_ex1;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
        CreateProduct(new Product() { ID = 1, Name = "Gaming Mouse", Category = "Electronics", Brand = "Logitech" });
    }

    static void CreateProduct(Product product)
    {
        using (ProductDbContext dbContext = new ProductDbContext())
        {
            dbContext.Products.Add(product);
            dbContext.SaveChanges();
        }
    }
}
