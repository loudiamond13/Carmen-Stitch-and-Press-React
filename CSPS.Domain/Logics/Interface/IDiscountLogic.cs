using CSPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IDiscountLogic
    {
        Task CreateOrderDiscountAsync(Discount discount);

        Task DeleteOrderDiscountAsync(int discountId);

        Task UpdateOrderDiscountAsync(Discount updatedDiscount);
    }
}
