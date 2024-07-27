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
        int Id { get; set; }
        string Title { get; set; }
        int Points { get; set; }
        string Department { get; set; }
    }
}
