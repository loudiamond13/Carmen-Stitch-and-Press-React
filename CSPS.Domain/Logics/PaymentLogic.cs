using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class PaymentLogic : IPaymentLogic
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;
        public PaymentLogic(IPaymentRepository paymentRepository, IOrderRepository orderRepository) 
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
        }

        #region create payment async
        public async Task CreatePaymentAsync(Payment payment) 
        {

            

            if (payment == null) 
            {
                throw new BusinessRuleException("Payment cannot be null!");
            }

            if (payment.Amount <= 0) 
            {
                throw new BusinessRuleException("Payment amount must be greater than zero.");
            }

            await _paymentRepository.AddAsync(payment);

            Order? order = await _orderRepository.GetAsync(x => x.OrderId == payment.OrderId,
                                                x => x.Include(p => p.Payments));
            if (order == null)
            {
                throw new BusinessRuleException("Order do not exists.");
            }

            order.RecalculateTotalPaymentsOnPaymentModification();

            if (order.TotalBalance < 0) 
            {
                var overPaidAmt = Math.Abs(((Int32)order.TotalBalance));
                throw new BusinessRuleException($"Over paid amount by {overPaidAmt} peso(s).");
            }

            
            await _paymentRepository.SaveAsync();
        }
        #endregion

        #region get all payment total
        public async Task<decimal> GetTotalPaymentsAsync(int year = 0) 
        {
            return await _paymentRepository.SumAsync(
                    p => (year == 0 || p.PaymentDate.Year == year) && !p.IsDeleted,
                    p => p.Amount
                );
        }
        #endregion

        #region delete order payment by id async
        public async Task DeleteOrderPaymentByIdAsync(int paymentId) 
        {
            if (paymentId <= 0) 
            {
                throw new BusinessRuleException($"Invalid Payment");
            }

            Payment payment = await _paymentRepository.GetAsync(x => x.PaymentId == paymentId) 
                                ?? throw new BusinessRuleException("Cannot find payment.");

            payment.IsDeleted = true;

            //_paymentRepository.Delete(payment);

            Order order = await _orderRepository.GetAsync(x => x.OrderId == payment.OrderId,
                                                                x => x.Include(x => x.Payments))
                                                            ?? throw new BusinessRuleException("Cannot find order");

            order.RecalculateTotalPaymentsOnPaymentModification();

            await _paymentRepository.SaveAsync();
        }
        #endregion
        #region Update Order Payment Async
        public async Task UpdateOrderPaymentAsync(Payment payment) 
        {
            if (payment.Amount <= 0) throw new BusinessRuleException("Invalid payment amount.");
            if (string.IsNullOrEmpty(payment.PaidBy)) throw new BusinessRuleException("Invalid payment.");
            if (string.IsNullOrEmpty(payment.PaidTo)) throw new BusinessRuleException("Invalid payment.");

            Payment paymentToBeUpdated = await _paymentRepository.GetAsync(x => x.PaymentId == payment.PaymentId)
                                                                    ?? throw new BusinessRuleException("Payment do not exists.");

            //update the payment
            paymentToBeUpdated.Amount = payment.Amount;
            paymentToBeUpdated.PaidBy = payment.PaidBy;
            paymentToBeUpdated.PaidTo = payment.PaidTo;

            Order order = await _orderRepository.GetAsync(x => x.OrderId == paymentToBeUpdated.OrderId,
                                                                o => o.Include(x => x.Payments))
                                                    ?? throw new BusinessRuleException("Cannot find order.");

            order.RecalculateTotalPaymentsOnPaymentModification();

            if (order.TotalBalance < 0)
            {
                var overPaidAmt = Math.Abs(((int)order.TotalBalance));
                throw new BusinessRuleException($"Over paid amount by {overPaidAmt} peso(s).");
            }


            await _paymentRepository.SaveAsync();
        }
        #endregion
    }
}
