//using w2_l5_ex1.Data;
//using w2_l5_ex1.Model;

//namespace w2_l5_ex1;

//class Program
//{
//    static void Main(string[] args)
//    {
//        Console.WriteLine("Hello, World!");
//        CreateProduct(new Product() { ID = 1, Name = "Gaming Mouse", Category = "Electronics", Brand = "Logitech" });

//        //var updated_mouse = new Product() { ID = 1, Name = "Gaming Mouse 2", Category = "Electronics", Brand = "Logitech" };

//        //IEnumerable<Product> products = GetProducts();
//        //foreach (Product p in products) Console.WriteLine($"{p.ID}, {p.Brand}, {p.Name}, {p.Category}");

//        //UpdateProduct(updated_mouse);

//    }

//    static void CreateProduct(Product product)
//    {
//        using (var dbContext = new ProductDbContext())
//        {
//            dbContext.Products.Add(product);
//            dbContext.SaveChanges();
//        }
//    }

//    static IEnumerable<Product> GetProducts()
//    {
//        using (var dbContext = new ProductDbContext())
//        {
//            return dbContext.Products.ToList();
//        }
//    }

//    static void UpdateProduct(Product product)
//    {
//        using (var dbContext = new ProductDbContext())
//        {
//            Product? selected_product = dbContext.Products.FirstOrDefault<Product>(e => e.ID == product.ID);
//            if (selected_product != null)
//            {
//                selected_product.ID = product.ID;
//                selected_product.Name = product.Name;
//                selected_product.Brand = product.Brand;
//                selected_product.Category = product.Category;
//                dbContext.SaveChanges();
//            }
//        }
//    }
//}


using w2_l5_ex1.Model;
using w2_l5_ex1.Data;
using System.Xml.Linq;


namespace w2_l5_ex1
{
    class Program
    {
        static void Main(string[] args)
        {

            CreateProduct(
                new Product
                {
                    ID = 1,
                    Name = "Iphone 14",
                    Brand = "Apple",
                    Category = "Phone"
                });


            //IEnumerable<Product> products = GetProduct();
            //foreach (Product p in products)
            //{
            //    Console.WriteLine($"ID: {p.Id}, Name: {p.Name}");
            //}
            //Console.WriteLine();

            //UpdateProduct(
            //    new Product
            //    {
            //        Id = 1,
            //        Name = "Iphone 12",
            //        Brand = "Apple",
            //        Category = "Phone"
            //    });

            //DeleteProduct(1);

            //IEnumerable<Product> AfterDeleteproducts = GetProduct();
            //foreach (Product p in AfterDeleteproducts)
            //{
            //    Console.WriteLine($"ID: {p.Id}, Name: {p.Name}");
            //}
        }

        private static void CreateProduct(Product p)
        {
            using (ProductDbContext db = new ProductDbContext())
            {
                db.Products.Add(p);
                db.SaveChanges();
            }
        }

        private static IEnumerable<Product> GetProduct()

        {
            List<Product> products;
            using (ProductDbContext db = new ProductDbContext())
            {
                products = db.Products.ToList();
            }
            return products;
        }

        private static void UpdateProduct(Product product)

        {
            using (ProductDbContext db = new ProductDbContext())
            {
                Product? p = db.Products.FirstOrDefault(p => p.ID == product.ID);
                if (p != null)
                {
                    p.Name = "Samsung note5";
                    p.Brand = "Samsung";
                    p.Category = "Phone";
                }

                db.SaveChanges();
            }
        }

        private static void DeleteProduct(int id)

        {
            using (ProductDbContext db = new ProductDbContext())
            {
                Product? p = db.Products.FirstOrDefault(p => p.ID == id);
                if (p != null)
                {
                    Console.WriteLine("Removed");
                    db.Remove(p);
                    db.SaveChanges();
                }

            }
        }

    }
}