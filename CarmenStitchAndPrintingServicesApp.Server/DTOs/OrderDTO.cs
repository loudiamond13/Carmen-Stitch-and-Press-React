using CSPS.Domain.Entities;
using CSPS.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class OrderDTO
    {
        public int OrderId { get; set; }

        [Required]
        public string OrderName { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Note { get; set; }

        public string? CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        public string? DeletedBy { get; set; }

        public bool IsDeleted { get; set; }

        public decimal PaidAmount { get; set; }

        public decimal TotalDiscount { get; set; }

        public decimal TotalBalance { get; set; }

        public decimal TotalExpenses { get; set; }

        public int StatusId { get; set; } = 0;
        public int OrderTypeId { get; set; } = 0;


        public virtual ICollection<DiscountDTO> Discounts { get; set; } = new List<DiscountDTO>();

        public virtual ICollection<ExpenseDTO> Expenses { get; set; } = new List<ExpenseDTO>();

        [Required]
        [MinLength(1, ErrorMessage ="An order must have at least one item.")]
        public virtual ICollection<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();

        public virtual ICollection<PaymentDTO> Payments { get; set; } = new List<PaymentDTO>();

        public virtual ICollection<OrderImageDTO> OrderImages { get; set; } = new List<OrderImageDTO>();


        public Order ToEntity()
        {
            Order order = new Order
            {
                OrderId = this.OrderId,
                OrderName = this.OrderName,
                OrderDate = this.OrderDate,
                TotalAmount = this.TotalAmount,
                Note = this.Note,
                CreatedBy = this.CreatedBy,
                UpdatedBy = this.UpdatedBy,
                DeletedBy = this.DeletedBy,
                IsDeleted = this.IsDeleted,
                PaidAmount = this.PaidAmount,
                TotalDiscount = this.TotalDiscount,
                TotalBalance = this.TotalBalance,
                TotalExpenses = this.TotalExpenses,
                StatusId = this.StatusId,
                OrderTypeId = this.OrderTypeId,
                OrderItems = this.OrderItems.Select(x => new OrderItem
                {
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    Description = x.Description,
                    IsDone = x.IsDone,
                    OrderId = x.OrderId,
                    Price = x.Price,
                    Quantity = x.Quantity,
                }).ToList(),
                Payments = this.Payments.Select(x => new Payment
                {
                    Amount = x.Amount,
                    CreatedBy = x.CreatedBy,
                    DeletedBy = x.DeletedBy,
                    IsDeleted = x.IsDeleted,
                    OrderId = x.OrderId,
                    PaidBy = x.PaidBy,
                    PaidTo = x.PaidTo,
                    PaymentDate = x.PaymentDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,


                }).ToList(),
                Discounts = this.Discounts.Select(x => new Discount
                {

                    Amount = x.Amount,
                    OrderId = x.OrderId,
                    UpdatedBy = x.UpdatedBy,
                    DiscountDate = x.DiscountDate,
                    Description = x.Description,
                    DiscountedBy = x.DiscountedBy,
                    UpdateDate = x.UpdateDate,


                }).ToList(),
                Expenses = this.Expenses.Select(x => new Expense
                {
                    OrderId = x.OrderId,
                    Description = x.Description,
                    SpentDate = x.SpentDate,
                    IsCompanyExpenses = x.IsCompanyExpenses,
                    Amount = x.Amount,
                    PaidBy = x.PaidBy,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                }).ToList(),

                OrderImages = this.OrderImages.Select(x => new OrderImage
                {
                    ImageUrl = x.ImageUrl,
                    OrderId = x.OrderId,
                    PublicId = x.PublicId,
                }).ToList(),


            };
            return order;
        }

        public static OrderDTO FromEntity(Order order)
        {
            OrderDTO orderDTO = new OrderDTO
            {
                OrderId = order.OrderId,
                OrderName = order.OrderName,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Note = order.Note,
                CreatedBy = order.CreatedBy,
                UpdatedBy = order.UpdatedBy,
                DeletedBy = order.DeletedBy,
                IsDeleted = order.IsDeleted,
                PaidAmount = order.PaidAmount,
                TotalDiscount = order.TotalDiscount,
                TotalBalance = order.TotalBalance,
                TotalExpenses = order.TotalExpenses,
                StatusId = order.StatusId,
                OrderTypeId = order.OrderTypeId,
                OrderItems = order.OrderItems.Select(x => new OrderItemDTO
                {
                    OrderItemId = x.OrderItemId,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    Description = x.Description,
                    IsDone = x.IsDone,
                    OrderId = x.OrderId,
                    Price = x.Price,
                    Quantity = x.Quantity,
                }).ToList(),
                Payments = order.Payments.Select(x => new PaymentDTO
                {
                    PaymentId = x.PaymentId,
                    Amount = x.Amount,
                    CreatedBy = x.CreatedBy,
                    DeletedBy = x.DeletedBy,
                    IsDeleted = x.IsDeleted,
                    OrderId = x.OrderId,
                    PaidBy = x.PaidBy,
                    PaidTo = x.PaidTo,
                    PaymentDate = x.PaymentDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                }).ToList(),
                Discounts = order.Discounts.Select(x => new DiscountDTO
                {
                    OrderDiscountId = x.OrderDiscountId,
                    Amount = x.Amount,
                    OrderId = x.OrderId,
                    UpdatedBy = x.UpdatedBy,
                    DiscountDate = x.DiscountDate,
                    Description = x.Description,
                    DiscountedBy = x.DiscountedBy,
                    UpdateDate = x.UpdateDate,
                }).ToList(),

                OrderImages = order.OrderImages.Select(x => new OrderImageDTO
                {
                    ImageId = x.ImageId,
                    ImageUrl = x.ImageUrl,
                    OrderId = x.OrderId,
                    PublicId = x.PublicId,
                }).ToList(),
                Expenses = order.Expenses.Select(x => new ExpenseDTO
                {
                    ExpenseId = x.ExpenseId,
                    OrderId = x.OrderId,
                    Description = x.Description,
                    SpentDate = x.SpentDate,
                    IsCompanyExpenses = x.IsCompanyExpenses,
                    Amount = x.Amount,
                    PaidBy = x.PaidBy,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate
                }).ToList()
            };
            return orderDTO;

        }
    }
}
