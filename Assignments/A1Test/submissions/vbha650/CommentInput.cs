using A1.Models;
using A1.Data;
using System.ComponentModel.DataAnnotations;

namespace A1.Dtos
{
    public class CommentInput
    {
        [Required]
        public string UserComment { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
