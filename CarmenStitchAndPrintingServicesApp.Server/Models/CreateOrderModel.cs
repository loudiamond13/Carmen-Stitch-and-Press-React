using CarmenStitchAndPrintingServicesApp.Server.DTOs;
using CSPS.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.Models
{
    public class CreateOrderModel
    {
        [Required]
        public string OrderName { get; set; } = "";
        [Required]
        public int OrderTypeId { get; set; }
        [Required]
        public int StatusId { get; set; }
        public string? Note { get; set; }
        public string? ImageUrl { get; set; } = "";

        public List<OrderItemDTO> orderItems { get; set; } = new List<OrderItemDTO>();
        public List<PaymentDTO> payments { get; set; } = new List<PaymentDTO>();

        public List<DiscountDTO> discounts { get; set; } = new List<DiscountDTO>();
    }
}
