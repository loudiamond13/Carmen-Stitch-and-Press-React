using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class OrderTypeLogic : IOrderTypeLogic
    {
        private readonly IOrderTypeRepository _orderTypeRepository;
        public OrderTypeLogic(IOrderTypeRepository orderTypeRepository)
        {
            _orderTypeRepository = orderTypeRepository;
        }

        public async Task<List<OrderType>> GetAllOrderTypes() 
        {
            var orderTypes = await _orderTypeRepository.GetAllAsync();
                        
            return orderTypes;
        }
    }
}
