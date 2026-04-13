using CSPS.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class PaymentDTO
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        public DateTime PaymentDate { get; set; }

        [Required]
        public string PaidBy { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public string UpdatedBy { get; set; } = string.Empty;

        public string DeletedBy { get; set; } = string.Empty;

        public bool IsDeleted { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Required]
        public string PaidTo { get; set; } = string.Empty;

        public DateTime? UpdatedDate { get; set; }


        public Payment ToEntity() 
        {
            Payment payment = new Payment
            {
                PaymentId = PaymentId,
                PaymentDate = PaymentDate,
                PaidBy = PaidBy,
                CreatedBy = CreatedBy,
                UpdatedBy = UpdatedBy,
                DeletedBy = DeletedBy,
                Amount = Amount,
                PaidTo = PaidTo,
                UpdatedDate = UpdatedDate,
                OrderId = OrderId,
                IsDeleted = IsDeleted,

            };

            return payment;
        }
    }
}
