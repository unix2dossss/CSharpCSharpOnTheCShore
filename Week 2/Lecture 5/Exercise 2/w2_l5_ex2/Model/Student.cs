using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace w2_l5_ex2.Model
{
    internal class Student
    {
        [Key]
        int Id { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        string? Email { get; set; }

    }
}
