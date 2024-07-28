using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace w2_l5_ex2.Model
{
    internal class Course
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int Points { get; set; }
        public string Department { get; set; }
    }
}
