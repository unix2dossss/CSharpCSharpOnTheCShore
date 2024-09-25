using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1.Models
{
    public class Sign
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Description { get; set; }
    }
}