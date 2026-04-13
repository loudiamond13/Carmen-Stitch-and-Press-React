using CSPS.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class ExpenseDTO
    {
        public int ExpenseId { get; set; }

        public int? OrderId { get; set; }

        [Required]
        public string Description { get; set; }

        public DateTime SpentDate { get; set; }

        public bool IsCompanyExpenses { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage ="Expense amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Required]
        public string PaidBy { get; set; } = string.Empty;

        public string? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }


        public Expense ToEntity() 
        {
            Expense expense = new Expense
            {
                ExpenseId = ExpenseId,
                OrderId = OrderId,
                Description = Description,
                SpentDate = SpentDate,
                Amount = Amount,
                IsCompanyExpenses = IsCompanyExpenses,
                PaidBy = PaidBy,
                UpdatedBy = UpdatedBy,
                UpdatedDate = UpdatedDate
            };

            return expense;
        }
    }
}
