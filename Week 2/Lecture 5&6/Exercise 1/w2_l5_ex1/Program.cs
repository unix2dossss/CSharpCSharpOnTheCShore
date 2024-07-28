using Microsoft.EntityFrameworkCore;
using w2_l5_ex1.Data;
using w2_l5_ex1.Model;

namespace w2_l5_ex1;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
        CreateProduct(new Product() { ID = 1, Name = "Gaming Mouse", Category = "Electronics", Brand = "Logitech" });

        //var updated_mouse = new Product() { ID = 1, Name = "Gaming Mouse 2", Category = "Electronics", Brand = "Logitech" };

        //IEnumerable<Product> products = GetProducts();
        //foreach (Product p in products) Console.WriteLine($"{p.ID}, {p.Brand}, {p.Name}, {p.Category}");

        //UpdateProduct(updated_mouse);

    }

    static void CreateProduct(Product product)
    {
        using (var dbContext = new ProductDbContext())
        {
            dbContext.Products.Add(product);
            dbContext.SaveChanges();
        }
    }

    static IEnumerable<Product> GetProducts()
    {
        using (var dbContext = new ProductDbContext())
        {
            return dbContext.Products.ToList();
        }
    }

    static void UpdateProduct(Product product)
    {
        using (var dbContext = new ProductDbContext())
        {
            Product? selected_product = dbContext.Products.FirstOrDefault<Product>(e => e.ID == product.ID);
            if (selected_product != null)
            {
                selected_product.ID = product.ID;
                selected_product.Name = product.Name;
                selected_product.Brand = product.Brand;
                selected_product.Category = product.Category;
                dbContext.SaveChanges();
            }
        }
    }

    static void DeleteProduct(int ID)
    {
        using (var dbContext = new ProductDbContext())
        {
            var selected_product = dbContext.Products.FirstOrDefault<Product>(e => e.ID == ID);
            if (selected_product != null)
            {
                dbContext.Products.Remove(selected_product);
                dbContext.SaveChanges();
            }
        }
    }
}