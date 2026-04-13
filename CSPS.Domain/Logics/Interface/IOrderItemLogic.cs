using CSPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IOrderItemLogic
    {
        Task CreateOrderItemAsync(OrderItem orderItem);
        Task DeleteOrderItemByIdAsync(int orderItemId);

        Task UpdateOrderItemAsync(OrderItem orderItem);
    }
}
