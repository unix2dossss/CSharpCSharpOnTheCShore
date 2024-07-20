using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace w1_l2_ex1
{
    internal class Motorcycle: Vehicle
    {
        public double EngineSize { get; set; }
        
        public void Ride()
        {
            Console.WriteLine("Writing the motorcycle...");
        }
    }
}
