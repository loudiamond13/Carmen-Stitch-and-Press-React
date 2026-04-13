using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class OrderImageLogic :IOrderImageLogic
    {
        private readonly IOrderImageRepository _orderImageRepository;
        public OrderImageLogic(IOrderImageRepository orderImageRepository)
        {
            _orderImageRepository = orderImageRepository;
        }

        #region delete order image
        public async Task DeleteOrderImageAsync(int orderImageId)
        {
            OrderImage orderImage = await _orderImageRepository.GetAsync(x => x.ImageId == orderImageId)
                                            ?? throw new BusinessRuleException("Cannot find image.");

            _orderImageRepository.Delete(orderImage);

            await _orderImageRepository.SaveAsync();

        }
        #endregion
        
        #region create order image async
        public async Task CreateOrderImageAsync(OrderImage orderImage)
        {
            await _orderImageRepository.AddAsync(orderImage);
            await _orderImageRepository.SaveAsync();
        }
        #endregion
    }
}
