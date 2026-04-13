using CSPS.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class OrderItemDTO
    {
        public int OrderItemId { get; set; }

        public int OrderId { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1,5000, ErrorMessage ="Quantity/Piece must be atleast 1.")]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage ="Price must be atleast greater than 1.")]
        public decimal Price { get; set; }

        public bool? IsDone { get; set; }

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public OrderItem ToEntity() 
        {
            OrderItem item = new OrderItem 
            {
                OrderItemId = OrderItemId,
                OrderId = OrderId,
                Description = Description,
                CreatedBy = CreatedBy,
                CreatedDate = CreatedDate,
                Quantity = Quantity,
                Price = Price,
                IsDone = IsDone,
                UpdatedBy = UpdatedBy,
                UpdatedDate =UpdatedDate
            };

            return item;
        }
    }


}
