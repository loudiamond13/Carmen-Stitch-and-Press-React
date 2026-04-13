using CSPS.DAL.DbContexts;
using CSPS.DAL.Repositories.Base;
using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;


namespace CSPS.DAL.Repositories
{
    public class DiscountRepository: GenericRepository<CSPSDbContext, Discount>, IDiscountRepository
    {
        public DiscountRepository(CSPSDbContext context):base(context)  
        {
        
        }
    }
}
