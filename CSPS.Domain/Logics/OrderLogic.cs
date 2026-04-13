
using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using CSPS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class OrderLogic: IOrderLogic
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderImageLogic _orderImageLogic;
        private readonly IOrderImageRepository _orderImageRepository;

        public OrderLogic(IOrderRepository orderRepository, IOrderImageLogic orderImageLogic, IOrderImageRepository orderImageRepository)
        {
            _orderRepository = orderRepository;
            _orderImageLogic = orderImageLogic;
            _orderImageRepository = orderImageRepository;
        }

        #region Get Orders Async
        public async Task<PagedResultModel<Order>> GetOrdersAsync(
            int pageNum, 
            int pageSize, 
            List<FilterModel> filters, 
            List<SortModel> sorts
        )
        {


            var paged = await _orderRepository.GetPagedAsync(
                    filters,sorts,pageNum,pageSize,
                    o=>o.Status,
                    o=>o.OrderType
                );


            return new PagedResultModel<Order>
            {
                Data = paged.Data,
                TotalCount = paged.TotalCount
            };


        }
        #endregion

        #region create/add order async
        public async Task CreateOrderAsync(Order order)
        {

            if (string.IsNullOrEmpty(order.OrderName))
            {
                throw new ArgumentException("Order name is required.");
            }


            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveAsync();
            return;
        }
        #endregion
        #region get order by id async
        public async Task<Order?> GetOrderByIdAsync(int id) 
        {
            var order = await _orderRepository.GetOrderByIdWithIncludesAsync(id);

            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {id} not found.");
            }
            return order;

        }
        #endregion

        #region get years distinct
        public async Task<List<int>> GetDistinctYearsAsync() 
        {
            var years = await _orderRepository.GetDistinctAsync(o => o.OrderDate.Year);
            return years.OrderByDescending(x =>x).ToList();
        }
        #endregion

        #region get all order total amount
        public async Task<decimal> GetAllOrderTotalAsync(int year = 0) 
        {
            return await _orderRepository.SumAsync(
                    o => (year == 0 || o.OrderDate.Year == year) && !o.IsDeleted,
                    o => o.TotalAmount
                );
        }
        #endregion
        
        
        #region update order async
        public async Task UpdateOrderAsync(Order updatedOrder)
        {
            if (string.IsNullOrEmpty(updatedOrder.OrderName)) throw new BusinessRuleException("Order name is required.");
            if (updatedOrder.StatusId <= 0) throw new BusinessRuleException("Order status is required.");
            if (updatedOrder.OrderTypeId <= 0) throw new BusinessRuleException("Order type is required.");


            var orderFromDB = await _orderRepository.GetOrderByIdWithIncludesAsync(updatedOrder.OrderId)
                          ?? throw new BusinessRuleException("Cannot find order.");

            //update
            orderFromDB.OrderName = updatedOrder.OrderName;
            orderFromDB.StatusId = updatedOrder.StatusId;
            orderFromDB.OrderTypeId = updatedOrder.OrderTypeId;
            orderFromDB.Note = updatedOrder.Note;

            if (updatedOrder.OrderImages.Any() && updatedOrder.OrderImages.Count > 0)
            {
                orderFromDB.OrderImages = updatedOrder.OrderImages;
            }


            await _orderRepository.SaveAsync();

        }
        #endregion
    }
}
