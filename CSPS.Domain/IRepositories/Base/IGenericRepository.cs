using CSPS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace CSPS.Domain.IRepositories.Base
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetAsync(Expression<Func<T,bool>> expression, Func<IQueryable<T>, IQueryable<T>>? includeBuilder = null);
        Task<List<T>> FindByAsync(Expression<Func<T,bool>> expression, params Expression<Func<T, object>>[] includes);
        Task AddAsync(T entity);
        Task SaveAsync();
        void Delete(T entity);

        Task<PagedResultModel<T>> GetPagedAsync(
            List<FilterModel> filters,
            List<SortModel> sorts,
            int pageNum,
            int pageSize,
            params Expression<Func<T, object>>[] includes);

        Task<List<TResult>> GetDistinctAsync<TResult>(
            Expression<Func<T, TResult>> selector,
            Expression<Func<T, bool>>? predicate = null);

        Task<decimal> SumAsync(Expression<Func<T, bool>> expression, Expression<Func<T,decimal>> selector);
    }
}
