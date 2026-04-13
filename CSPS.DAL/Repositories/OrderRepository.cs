using CSPS.DAL.DbContexts;
using CSPS.DAL.Repositories.Base;
using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;


namespace CSPS.DAL.Repositories
{
    public class OrderRepository:GenericRepository<CSPSDbContext,Order>, IOrderRepository
    {

        public OrderRepository(CSPSDbContext cSPSDbContext):base(cSPSDbContext)
        {
            
        }

        public async Task<Order?> GetOrderByIdWithIncludesAsync(int id)
        {
            return await _dbSet.Include(oi => oi.OrderItems)
                                .Include(d => d.Discounts)
                                .Include(p => p.Payments.Where(p => !p.IsDeleted))
                                .Include(i => i.OrderImages)
                                .Include(e => e.Expenses)
                                .Include(s => s.Status)
                                .Include(ot => ot.OrderType)
                                .AsSplitQuery()
                                .FirstOrDefaultAsync(o => o.OrderId == id && !o.IsDeleted);
        }

    }
}
