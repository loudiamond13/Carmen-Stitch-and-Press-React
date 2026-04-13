using CSPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IPaymentLogic
    {
        Task CreatePaymentAsync(Payment payment);

        Task<decimal> GetTotalPaymentsAsync(int year = 0);

        Task DeleteOrderPaymentByIdAsync(int paymentId);

        Task UpdateOrderPaymentAsync(Payment payment);
    }
}
