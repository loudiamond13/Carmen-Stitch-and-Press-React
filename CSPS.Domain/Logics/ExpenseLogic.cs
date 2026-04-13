using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using CSPS.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace CSPS.Domain.Logics
{
    public class ExpenseLogic: IExpenseLogic
    {
        private readonly IExpenseRepository _expenseRepository;
        private readonly IOrderRepository _orderRepository;

        public ExpenseLogic(IExpenseRepository expenseRepository, IOrderRepository orderRepository)
        {
            _expenseRepository = expenseRepository;
            _orderRepository = orderRepository;
        }

        #region create order expense async
        public async Task CreateOrderExpenseAsync(Expense expense) 
        {
            if (expense == null) 
            {
                throw new BusinessRuleException("Expense cannot be null");
            }

            if (expense.Amount <= 0) 
            {
                throw new BusinessRuleException("Expense amount must be greater than zero.");
            }

            await _expenseRepository.AddAsync(expense);

            Order? order = await _orderRepository.GetAsync(x => x.OrderId == expense.OrderId,
                                                        x => x.Include(e => e.Expenses));

            if (order == null) 
            {
                throw new BusinessRuleException("Order do not exists.");
            }

            await order.RecalculateOrderExpenses();

            await _expenseRepository.SaveAsync();
        }
        #endregion
        
        #region Create Company Expense Async
        public async Task CreateCompanyExpenseAsync(Expense expense)
        {
            if (expense == null) throw new BusinessRuleException("Expense data is missing.");
            if (expense.Amount <= 0) throw new BusinessRuleException("Expenses must have a positive amount.");
            if (string.IsNullOrEmpty(expense.Description)) throw new BusinessRuleException("Invalid expense description");

            expense.IsCompanyExpenses = true;
            await _expenseRepository.AddAsync(expense);
            await _expenseRepository.SaveAsync();
        }
        #endregion

        #region get paged expenses async
        public async Task<PagedResultModel<Expense>> GetExpensesAsync(int pageNum, int pageSize, List<FilterModel> filters, List<SortModel> sorts) 
        {

            var paged = await _expenseRepository.GetPagedAsync(filters,sorts,pageNum,pageSize);

            return new PagedResultModel<Expense>
            {
                Data = paged.Data,
                TotalCount = paged.TotalCount
            };

        }
        #endregion


        #region sum expense
        public async Task<decimal> GetTotalExpensesAsync(int year = 0)
        {
            return await _expenseRepository.SumAsync(
                    e => year == 0 || e.SpentDate.Year == year,
                    e => e.Amount
                );

        }
        #endregion
        
        #region delete expense async
        public async Task DeleteExpenseAsync(int expenseId)
        {
            Expense expense = await _expenseRepository.GetAsync(x => x.ExpenseId == expenseId)
                                            ?? throw new BusinessRuleException("Cannot find expense");

             _expenseRepository.Delete(expense);

            if (expense.OrderId != 0 || expense.OrderId != null) 
            {
                Order order = await _orderRepository.GetAsync(o => o.OrderId == expense.OrderId,
                                                                e => e.Include(e => e.Expenses))
                                                    ?? throw new BusinessRuleException("Cannot find order.");

                await order.RecalculateOrderExpenses();
            }

            await _expenseRepository.SaveAsync();
        }
        #endregion
        #region update expense async
        public async Task UpdateExpenseAsync(Expense expense) 
        {
            if (string.IsNullOrEmpty(expense.Description)) throw new BusinessRuleException("Invalid expense description.");
            if (expense.Amount <=0 ) throw new BusinessRuleException("Invalid expense.");
            if (string.IsNullOrEmpty(expense.PaidBy)) throw new BusinessRuleException("Invalid expense.");

            Expense expenseToBeUpdated = await _expenseRepository.GetAsync(e => e.ExpenseId == expense.ExpenseId)
                                                        ?? throw new BusinessRuleException("Cannot find expense.");


            expenseToBeUpdated.Description = expense.Description;
            expenseToBeUpdated.Amount = expense.Amount;
            expenseToBeUpdated.PaidBy = expense.PaidBy;


            if (expense.OrderId > 0)
            {
                Order order = await _orderRepository.GetAsync(o => o.OrderId == expense.OrderId,
                                                                e => e.Include(e => e.Expenses))
                                                    ?? throw new BusinessRuleException("Cannot find order.");

                await order.RecalculateOrderExpenses();
            }

            await _expenseRepository.SaveAsync();
        }
        #endregion
    }
}
