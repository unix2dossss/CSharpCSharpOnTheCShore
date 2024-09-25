using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1.Models
{
    public class Comment
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string UserComment { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Time { get; set; }

        [Required]
        public string IP { get; set; }
    }
}