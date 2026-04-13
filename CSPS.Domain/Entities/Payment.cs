using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        public DateTime PaymentDate { get; set; }

        public string PaidBy { get; set; }

        public string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        public string? DeletedBy { get; set; }

        public bool IsDeleted { get; set; } = false;

        public decimal Amount { get; set; }

        public string PaidTo { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public virtual Order Order { get; set; }
    }
}
