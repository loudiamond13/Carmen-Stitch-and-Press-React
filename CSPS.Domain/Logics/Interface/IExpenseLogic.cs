using CSPS.Domain.Entities;
using CSPS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IExpenseLogic
    {
        Task CreateOrderExpenseAsync(Expense expense);
        Task CreateCompanyExpenseAsync(Expense expense);

        Task<PagedResultModel<Expense>> GetExpensesAsync(int pageNum, int pageSize, List<FilterModel> filters, List<SortModel> sorts);

        Task<decimal> GetTotalExpensesAsync(int year = 0);

        Task DeleteExpenseAsync(int expenseId);
        Task UpdateExpenseAsync(Expense expense);
    }
}
