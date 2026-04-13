using CSPS.DAL.DbContexts;
using CSPS.DAL.Repositories.Base;
using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.DAL.Repositories
{
    public class ExpenseRepository: GenericRepository<CSPSDbContext, Expense>, IExpenseRepository
    {
        public ExpenseRepository(CSPSDbContext cSPSDbContext): base(cSPSDbContext) 
        {
            
        }
    }
}
