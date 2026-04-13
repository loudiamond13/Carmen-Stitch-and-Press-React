
using CSPS.Domain.Entities;
using CSPS.Domain.Models;


namespace CSPS.Domain.Logics.Interface
{
    public interface IOrderLogic
    {
        Task<PagedResultModel<Order>> GetOrdersAsync(int pageNum, int pageSize, List<FilterModel> filters, List<SortModel> sorts);
        Task CreateOrderAsync(Order order);

        Task<Order?> GetOrderByIdAsync(int id);

        Task<List<int>> GetDistinctYearsAsync();

        Task<decimal> GetAllOrderTotalAsync(int year = 0);

        Task UpdateOrderAsync(Order updatedOrder);
    }
}
