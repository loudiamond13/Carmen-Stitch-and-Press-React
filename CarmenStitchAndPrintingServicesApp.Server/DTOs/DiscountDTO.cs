using CSPS.Domain.Entities;

namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class DiscountDTO
    {
        public int OrderDiscountId { get; set; }

        public int OrderId { get; set; }

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string DiscountedBy { get; set; } = string.Empty;

        public string? UpdatedBy { get; set; }

        public DateTime? DiscountDate { get; set; }

        public DateTime? UpdateDate { get; set; }

        public Discount ToEntity() 
        {
            Discount discount = new Discount
            {
                OrderDiscountId = OrderDiscountId,
                OrderId = OrderId,
                Description = Description,
                Amount = Amount,
                DiscountedBy = DiscountedBy,
                UpdatedBy = UpdatedBy,
                UpdateDate = UpdateDate,
                DiscountDate = DiscountDate,
            };

            return discount;
        }
    }
}
