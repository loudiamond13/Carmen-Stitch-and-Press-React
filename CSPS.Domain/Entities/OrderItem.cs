using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }

        public int OrderId { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public bool? IsDone { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? UpdatedBy { get; set; }
        
        public DateTime? UpdatedDate { get; set; }

        public virtual Order Order { get; set; }

        
    }
}
