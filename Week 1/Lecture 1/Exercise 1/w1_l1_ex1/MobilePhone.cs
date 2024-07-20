using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace w1_l1_ex1
{
    internal class MobilePhone
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public int StorageCapacity { get; set; }
        public int RAM { get; set; }
        public double DisplaySize { get; set; }
        public decimal Price { get; set; }
        public void PrintDetails()
        {
            Console.WriteLine("Brand: {0}", Brand);
            Console.WriteLine("Model: {0}", Model);
            Console.WriteLine("Storage Capacity: {0} GB", StorageCapacity);
            Console.WriteLine("RAM: {0} GB", RAM);
            Console.WriteLine("Display Size: {0} inches", DisplaySize);
            Console.WriteLine("Price: ${0}", Price);
        }
    }
}
