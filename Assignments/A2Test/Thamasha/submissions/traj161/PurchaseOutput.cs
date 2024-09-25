using System;
using System.ComponentModel.DataAnnotations;

namespace A2.Dtos
{
	public class PurchaseOutput
	{
        [Required]
        public string UserName { get; set; }
        [Required]
        public string SignID { get; set; }

    }
}

