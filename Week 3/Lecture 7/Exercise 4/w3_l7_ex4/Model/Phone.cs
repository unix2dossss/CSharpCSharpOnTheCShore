using System.ComponentModel.DataAnnotations;

namespace w3_l7_ex4.Model
{
    public class Phone
    {
        [Key]
        public int PhoneId { get; set; }
        [Required]
        public string BrandName { get; set; }
        [Required]
        public string ModelName { get; set; }
        [Required]
        public float Price { get; set; }
    }
}
