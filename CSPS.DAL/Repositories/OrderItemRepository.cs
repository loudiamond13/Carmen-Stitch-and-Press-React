using CSPS.DAL.DbContexts;
using CSPS.DAL.Repositories.Base;
using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using CSPS.Domain.IRepositories.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.DAL.Repositories
{
    public class OrderItemRepository: GenericRepository<CSPSDbContext, OrderItem>, IOrderItemRepository
    {
        public OrderItemRepository(CSPSDbContext cSPSDbContext):base(cSPSDbContext)
        {
            
        }
    }
}
