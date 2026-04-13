using CSPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IOrderImageLogic
    {
        Task DeleteOrderImageAsync(int orderImageId);
        Task CreateOrderImageAsync(OrderImage orderImage);
    }
}
