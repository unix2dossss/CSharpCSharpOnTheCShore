namespace w1_l1_ex1;

class Program
{
    static void Main(string[] args)
    {
        MobilePhone Phone1 = new MobilePhone() { Brand = "Apple", Model="iPhone 14 Pro", StorageCapacity=128, RAM=6, DisplaySize=6.1, Price=999.99m };
        MobilePhone Phone2 = new MobilePhone() { Brand = "Samsung", Model="Galaxy S23 Ultra", StorageCapacity=256, RAM=12, DisplaySize=6.8, Price=999.99m };
        MobilePhone Phone3 = new MobilePhone() { Brand = "Google", Model="Pixel 7", StorageCapacity=128, RAM=8, DisplaySize = 6.3, Price = 699.99m };

    }
}
