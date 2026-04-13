using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;
using CSPS.Domain.Entities;

namespace CSPS.DAL.Interceptors
{
    public class OrderAuditAndTotalInterceptor:SaveChangesInterceptor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OrderAuditAndTotalInterceptor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUser() 
        {
            return _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
        }


        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
            ) 
        {
            var context = eventData.Context;
            if (context is null) 
            {
                return await base.SavingChangesAsync(eventData, result, cancellationToken);
            }

            var philippineTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Manila");
            var dateTimeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, philippineTimeZone);

            var currentUser = GetCurrentUser();

            int? orderId = null;

            foreach (var entry in context.ChangeTracker.Entries()) 
            {
                if (entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                switch (entry.Entity) 
                {
                    case Order order:
                        if (entry.State == EntityState.Added) 
                        {
                            order.CreatedBy = currentUser;
                            order.OrderDate = dateTimeNow;
                            order.IsDeleted = false;
                        } 
                        else if (entry.State == EntityState.Modified) 
                        {
                            order.UpdatedBy = currentUser;
                            

                        } 
                        else if (entry.State == EntityState.Deleted) 
                        {
                            order.DeletedBy = currentUser;
                            order.IsDeleted = true;
                            entry.State = EntityState.Modified; //soft delete
                        }
                        orderId = order.OrderId; 
                        break;

                    case OrderItem orderItem:
                        if (entry.State == EntityState.Added)
                        {
                            orderItem.CreatedBy = currentUser;
                            orderItem.CreatedDate = dateTimeNow;
                            orderItem.IsDone = false;
                        }
                        else if (entry.State == EntityState.Modified)
                        {
                            orderItem.UpdatedDate = dateTimeNow;
                            orderItem.UpdatedBy = currentUser;
                        }
                        orderId = orderItem.OrderId;
                        break;

                    case Payment payment:
                        if (entry.State == EntityState.Added) 
                        {
                            payment.CreatedBy = currentUser;
                            payment.PaymentDate = dateTimeNow;
                            payment.IsDeleted = false;
                        }
                        else if (entry.State == EntityState.Modified && payment.IsDeleted == true) 
                        {
                            payment.DeletedBy = currentUser;
                            payment.UpdatedDate = dateTimeNow;

                        } 
                        else if (entry.State == EntityState.Modified) 
                        {
                            payment.UpdatedBy = currentUser;
                            payment.UpdatedDate = dateTimeNow;
                        }
                        orderId = payment.OrderId;
                        break;
                    case Discount discount:
                        if (entry.State == EntityState.Added) 
                        {
                            discount.DiscountedBy = currentUser;
                            discount.DiscountDate = dateTimeNow;
                        }
                        else if (entry.State == EntityState.Modified) 
                        {
                            discount.UpdatedBy = currentUser;
                            discount.UpdateDate = dateTimeNow;
                        }
                        orderId = discount.OrderId;
                        break;
                    case Expense expense:
                        if (entry.State == EntityState.Added) 
                        {
                            expense.SpentDate = dateTimeNow;
                            expense.UpdatedBy = currentUser;
                        }
                        else if (entry.State == EntityState.Modified) 
                        {
                            expense.UpdatedBy = currentUser;
                            expense.UpdatedDate = dateTimeNow;
                        }
                        orderId = expense.OrderId;
                        break;
                    case MoneyTransfer moneyTransfer:
                        if (entry.State == EntityState.Added) 
                        {
                            moneyTransfer.TransferBy = currentUser;
                            moneyTransfer.TransferDate = dateTimeNow;
                        }
                        else if (entry.State == EntityState.Modified) 
                        {
                            moneyTransfer.UpdatedBy = currentUser;
                            moneyTransfer.UpdatedDate = dateTimeNow;
                        }
                        
                        break;
                }
            }

            if (orderId.HasValue) 
            {
                var orderEntry = context.ChangeTracker.Entries<Order>()
                    .FirstOrDefault(e => e.Entity.OrderId == orderId.Value);

                Order? order;

                if (orderEntry != null && orderEntry.State == EntityState.Added)
                {
                    order = orderEntry.Entity;

                    var orderItems = order.OrderItems;
                    var payments = order.Payments.Where(x => !x.IsDeleted);
                    var discounts = order.Discounts;
                    var expenses = order.Expenses;

                    //calculate totals from tracked entities
                    order.TotalDiscount = discounts.Sum(d => d.Amount);
                    order.TotalAmount = orderItems.Sum(oi => oi.Quantity * oi.Price) - order.TotalDiscount;
                    order.PaidAmount = payments.Sum(p => p.Amount);
                    order.TotalBalance = order.TotalAmount - order.PaidAmount;
                    order.TotalExpenses = expenses.Sum(e => e.Amount);


                }
                //else 
                //{
                //    order = await context.Set<Order>()
                //        .Include(o => o.OrderItems)
                //        .Include(o => o.Payments.Where(p => !p.IsDeleted))
                //        .Include(o => o.Discounts)
                //        .Include(o => o.Expenses)
                //        .FirstOrDefaultAsync(o => o.OrderId == orderId.Value, cancellationToken);

                //    if (order != null) 
                //    {
                //        order.TotalDiscount = order.Discounts.Sum(d => d.Amount);
                //        order.TotalAmount = order.OrderItems.Sum(i => i.Price * i.Quantity) - order.TotalDiscount;
                //        order.PaidAmount = order.Payments.Where(p => !p.IsDeleted).Sum(p => p.Amount);
                //        order.TotalBalance = order.TotalAmount - order.PaidAmount;
                //        order.TotalExpenses = order.Expenses.Sum(i => i.Amount);

                //        order.UpdatedBy = currentUser;
                //    }
                //}

            }
            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}
