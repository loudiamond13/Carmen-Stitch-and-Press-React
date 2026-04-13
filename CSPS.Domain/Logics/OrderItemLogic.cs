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
    public class OrderItemLogic: IOrderItemLogic
    {
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderItemLogic(IOrderItemRepository orderItemRepository, IOrderRepository orderRepository)
        {
            _orderItemRepository = orderItemRepository;
            _orderRepository = orderRepository;
        }

        #region
        public async Task CreateOrderItemAsync(OrderItem orderItem) 
        {
            if (orderItem == null) 
            {
                throw new BusinessRuleException("Order Item cannot be null.");
            }

            if (orderItem.Quantity <= 0) 
            {
                throw new BusinessRuleException("Order Item Quantity cannot be less than one.");
            }

            if (string.IsNullOrEmpty(orderItem.Description)) 
            {
                throw new BusinessRuleException("Order Item description cannot be empty.");
            }

            if (orderItem.OrderId == 0)
            {
                throw new BusinessRuleException($"Order {orderItem.OrderId}  cannot be found.");
            }

            await _orderItemRepository.AddAsync(orderItem);

            Order? order = await _orderRepository.GetAsync(x => x.OrderId == orderItem.OrderId,
                                                             x =>x.Include(o => o.OrderItems));

            if (order == null)
            {
                throw new BusinessRuleException("Order cannot be found.");
            }


            order.RecalculateOrderTotalsOnOrderItemModification();

            await _orderItemRepository.SaveAsync();
        }
        #endregion

        #region delete order item by id async
        public async Task DeleteOrderItemByIdAsync(int orderItemId) 
        {
            if (orderItemId <= 0) 
            {
                throw new BusinessRuleException("Invalid Order Item.");
            }

            OrderItem orderItem = await _orderItemRepository.GetAsync(x =>x.OrderItemId == orderItemId)
                                    ?? throw new BusinessRuleException("Cannot find order item.");

            _orderItemRepository.Delete(orderItem);


            Order order = await _orderRepository.GetAsync(x => x.OrderId == orderItem.OrderId,
                                                            x => x.Include(x => x.OrderItems)
                                                            .Include(x => x.Discounts))
                                                        ?? throw new BusinessRuleException("Cannot find order.");



            order.RecalculateOrderTotalsOnOrderItemModification();
            await _orderItemRepository.SaveAsync();


        }
        #endregion

        #region Update order item async
        public async Task UpdateOrderItemAsync(OrderItem orderItem)
        {
            if (string.IsNullOrEmpty(orderItem.Description)) throw new BusinessRuleException("Invalid order item description");
            if (orderItem.Quantity <= 0) throw new BusinessRuleException("Order item quantity must be greater than 1.");
            if (orderItem.Price <= 0) throw new BusinessRuleException("Order item price must be greater than 1.");

            OrderItem orderItemTobeUpdated = await _orderItemRepository.GetAsync(oi => oi.OrderItemId == orderItem.OrderItemId)
                                                    ?? throw new BusinessRuleException("Cannot find order item.");

            orderItemTobeUpdated.Quantity = orderItem.Quantity;
            orderItemTobeUpdated.Price = orderItem.Price;
            orderItemTobeUpdated.Description = orderItem.Description;

            Order order = await _orderRepository.GetAsync(o => o.OrderId == orderItemTobeUpdated.OrderId,
                                                                oi => oi.Include(oi => oi.OrderItems))
                                                                ?? throw new BusinessRuleException("Cannot find parent order.");


            order.RecalculateOrderTotalsOnOrderItemModification();

            await _orderItemRepository.SaveAsync();
        }
        #endregion
    }
}
