using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class DiscountLogic: IDiscountLogic
    {
        private readonly IDiscountRepository _discountRepository;
        private readonly IOrderRepository _orderRepository;
        public DiscountLogic(IDiscountRepository discountRepository, IOrderRepository orderRepository)
        {
            _discountRepository = discountRepository;
            _orderRepository = orderRepository;
        }

        #region create order discount async
        public async Task CreateOrderDiscountAsync(Discount discount) 
        {
            if (discount == null) 
            {
                throw new BusinessRuleException("Discount cannot be null!");
            }

            if (discount.Amount <= 0) 
            {
                throw new BusinessRuleException("Discount amount must be greater than 0.");
            }

            if (discount.OrderId == 0) 
            {
                throw new BusinessRuleException("Order is required.");
            }

            await _discountRepository.AddAsync(discount);

            Order? order = await _orderRepository.GetAsync(x => x.OrderId == discount.OrderId,
                                                            x => x.Include(d => d.Discounts)
                                                                   .Include(oi => oi.OrderItems));

            if (order == null) 
            {
                throw new BusinessRuleException("Unable to get order.");
            }

            order.RecalculateOrderTotalsOnDiscountModification();

            if (order.TotalBalance < 0) 
            {
                throw new BusinessRuleException("Total balance cannot be less than 0.");
            }

            await _discountRepository.SaveAsync();
        }
        #endregion


        #region delete order discount async
        public async Task DeleteOrderDiscountAsync(int discountId) 
        {
            Discount discount = await _discountRepository.GetAsync(x => x.OrderDiscountId == discountId) 
                                    ?? throw new BusinessRuleException("Cannot find order discount.");

            _discountRepository.Delete(discount);

            Order order = await _orderRepository.GetAsync(x => x.OrderId == discount.OrderId,
                                                                x => x.Include(x => x.Discounts)
                                                                .Include(oi => oi.OrderItems))
                                                        ?? throw new BusinessRuleException("Cannot find order.");

            order.RecalculateOrderTotalsOnDiscountModification();

            await _discountRepository.SaveAsync();

        }
        #endregion

        #region Update Order Discount Async
        public async Task UpdateOrderDiscountAsync(Discount updatedDiscount) 
        {

            if (updatedDiscount.Amount <= 0)  throw new BusinessRuleException("Invalid discount amount.");
            if (string.IsNullOrEmpty(updatedDiscount.Description)) throw new BusinessRuleException("Discount description is required.");


            Discount discountFromDB = await _discountRepository.GetAsync(x => x.OrderDiscountId == updatedDiscount.OrderDiscountId)
                                                ?? throw new BusinessRuleException("Cannot find discount.");

            discountFromDB.Amount = updatedDiscount.Amount;
            discountFromDB.Description = updatedDiscount.Description;


            Order order = await _orderRepository.GetAsync(o => o.OrderId == discountFromDB.OrderId,
                                                            o => o.Include(oi => oi.OrderItems)
                                                                    .Include(d => d.Discounts))
                                                        ?? throw new BusinessRuleException("Cannot find order.");


            order.RecalculateOrderTotalsOnDiscountModification();

            if(order.TotalBalance < 0) 
            {
                throw new BusinessRuleException("Total balance cannot be negative.");
            }

            await _discountRepository.SaveAsync();
        }
        #endregion
    }
}
