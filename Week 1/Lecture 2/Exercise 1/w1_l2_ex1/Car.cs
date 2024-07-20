using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace w1_l2_ex1
{
    internal class Car: Vehicle
    {
        public int NumberOfDoors { get; set; }
        public string Type { get; set; }

        public void Drive()
        {
            Console.WriteLine("Driving the car...");
        }
    }
}
