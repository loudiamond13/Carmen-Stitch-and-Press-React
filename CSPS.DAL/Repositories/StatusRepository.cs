using CSPS.DAL.DbContexts;
using CSPS.DAL.Repositories.Base;
using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.DAL.Repositories
{
    public class StatusRepository:GenericRepository<CSPSDbContext,Status>, IStatusRepository
    {
        public StatusRepository(CSPSDbContext context):base(context)
        {
            
        }
    }
}
