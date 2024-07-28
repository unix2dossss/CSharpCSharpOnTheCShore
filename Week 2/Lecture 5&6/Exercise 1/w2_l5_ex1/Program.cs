using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update.Internal;
using w2_l5_ex1.Data;
using w2_l5_ex1.Model;

namespace w2_l5_ex1;

class Program
{
    static void Main(string[] args)
    {
        CreateProduct(new Product() { ID = 1, Name = "Gaming Mouse", Category = "Electronics", Brand = "Logitech" });
        CreateProduct(new Product() { ID = 2, Name = "Gaming Keyboard", Category = "Electronics", Brand = "Logitech" });
        CreateProduct(new Product() { ID = 3, Name = "Gaming Monitor", Category = "Electronics", Brand = "Logitech" });

        var updated_mouse = new Product() { ID = 4, Name = "gaming mouse 2", Category = "electronics", Brand = "logitech" };

        IEnumerable<Product> products = GetProducts();
        foreach (Product p in products) Console.WriteLine($"{p.ID}, {p.Brand}, {p.Name}, {p.Category}");

        UpdateProduct(updated_mouse);

        //DeleteProduct(2);

        //products = GetProducts();
        //foreach (Product p in products) Console.WriteLine($"{p.ID}, {p.Brand}, {p.Name}, {p.Category}");
    }

    static void CreateProduct(Product product)
    {
        using (var dbContext = new ProductDbContext())
        {
            var p = dbContext.Products.FirstOrDefault<Product>(p=>p.ID == product.ID);
            if (p == null)
            {
                dbContext.Products.Add(product);
                dbContext.SaveChanges();
            } else
            {
                Console.WriteLine("A product with this ID already exists");
            }
            
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
            } else
            {
                Console.WriteLine("There is no such product! Use CreateProduct() instead.");
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
            } else
            {
                Console.WriteLine("No such product to delete!");
            }
        }
    }
}