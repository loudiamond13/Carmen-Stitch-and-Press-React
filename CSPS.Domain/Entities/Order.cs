using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }

        public string OrderName { get; set; } = "";

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Note { get; set; }

        public string? CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        public string? DeletedBy { get; set; }

        public bool IsDeleted { get; set; }

        public decimal PaidAmount { get; set; } = 0;

        public decimal TotalDiscount { get; set; } = 0;

        public decimal TotalBalance { get; set; } = 0;

        public decimal TotalExpenses { get; set; } = 0;

        public int StatusId { get; set; } = 0;

        
        public Status? Status { get; set; } 

        public int OrderTypeId { get; set; } = 0;
        public OrderType? OrderType { get; set; }

        public virtual ICollection<Discount> Discounts { get; set; } = new List<Discount>();

        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public virtual ICollection<OrderImage> OrderImages { get; set; } = new List<OrderImage>();


        public void RecalculateTotals()
        {
            TotalDiscount = Discounts.Sum(d => d.Amount);

            TotalAmount = OrderItems.Sum(i => i.Price * i.Quantity) - TotalDiscount;

            PaidAmount = Payments.Where(p => !p.IsDeleted).Sum(p => p.Amount);

            TotalBalance = TotalAmount - PaidAmount;

            TotalExpenses = Expenses.Sum(e => e.Amount);
        }

        public void RecalculateTotalPaymentsOnPaymentModification() 
        {
            PaidAmount = Payments.Where(p => !p.IsDeleted).Sum(p => p.Amount);
            TotalBalance = TotalAmount - PaidAmount;
        }

        public void RecalculateOrderTotalsOnOrderItemModification() 
        {
            //TotalDiscount = Discounts.Sum(d => d.Amount);
            TotalAmount = OrderItems.Sum(i => i.Price * i.Quantity) - TotalDiscount;
            TotalBalance = Math.Max(0, TotalAmount - PaidAmount);
        }

        public void RecalculateOrderTotalsOnDiscountModification() 
        {
            TotalDiscount = Discounts.Sum(d => d.Amount);
            var subtotal = OrderItems.Sum(i => i.Price * i.Quantity);
            TotalAmount = subtotal - TotalDiscount;
            TotalBalance = TotalAmount - PaidAmount;
        }

        public async Task RecalculateOrderExpenses() 
        {
            TotalExpenses = Expenses.Sum(x => x.Amount);
        }
    }
}
