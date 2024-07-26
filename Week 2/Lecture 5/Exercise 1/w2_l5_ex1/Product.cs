using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace w2_l5_ex1
{
    internal class Product
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public string? Category { get; set; }
        public string? Brand { get; set; }
    }
}
