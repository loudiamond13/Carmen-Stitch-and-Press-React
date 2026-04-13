using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class Discount
    {
        public int OrderDiscountId { get; set; }

        public int OrderId { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }

        public string DiscountedBy { get; set; } = string.Empty;

        public string? UpdatedBy { get; set; }

        public DateTime? DiscountDate { get; set; }

        public DateTime? UpdateDate { get; set; }

        public virtual Order Order { get; set; }
    }
}
