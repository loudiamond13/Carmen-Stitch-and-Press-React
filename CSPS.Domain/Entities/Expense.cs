using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class Expense
    {
        public int ExpenseId { get; set; }

        public int? OrderId { get; set; }

        public string Description { get; set; }

        public DateTime SpentDate { get; set; }

        public bool IsCompanyExpenses { get; set; }

        public decimal Amount { get; set; }

        public string PaidBy { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public virtual Order Order { get; set; }
    }
}
