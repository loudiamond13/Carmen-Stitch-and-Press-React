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
    public class PaymentRepository: GenericRepository<CSPSDbContext, Payment>, IPaymentRepository
    {
        public PaymentRepository(CSPSDbContext cSPSDbContext):base(cSPSDbContext)
        {
            
        }
    }
}
