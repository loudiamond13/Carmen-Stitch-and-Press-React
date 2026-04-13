using CSPS.Domain.IRepositories.Base;
using CSPS.Domain.Models;
using CSPS.Domain.QueryExtensions;
using Microsoft.AspNetCore.Http.Features.Authentication;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using System.Text;

namespace CSPS.DAL.Repositories.Base
{
    public class GenericRepository<C, T> : IGenericRepository<T>
        where T : class
        where C : DbContext
    {
        protected readonly C _context;
        protected readonly DbSet<T> _dbSet;
        public GenericRepository(C context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<T>();
        }
        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }
        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }
        public virtual async Task<List<T>> FindByAsync(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet.Where(expression);
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }
            return await query.ToListAsync();
        }
        public virtual async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
        public virtual async Task<T?> GetAsync(Expression<Func<T, bool>> expression, Func<IQueryable<T>, IQueryable<T>>? includeBuilder = null)
        {

            IQueryable<T> query = _dbSet;
            if (includeBuilder != null)
            {
                query = includeBuilder(query);
            }
            return await query.FirstOrDefaultAsync(expression);
        }
        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }


        public async Task<PagedResultModel<T>> GetPagedAsync(
            List<FilterModel> filters,
            List<SortModel> sorts,
            int pageNum,
            int pageSize,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
                query = query.Include(include);


            query = query.ApplyFilters(filters);
            query = query.ApplySorting(sorts);
            var totalCount = await query.CountAsync();

            var data = await query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResultModel<T>
            {
                Data = data,
                TotalCount = totalCount
            };
        }

        public virtual async Task<List<TResult>> GetDistinctAsync<TResult>(
            Expression<Func<T, TResult>> selector,
            Expression<Func<T, bool>>? predicate = null)
        {
            IQueryable<T> query = _dbSet;
            if (predicate != null) query = query.Where(predicate);

            return await query
                .Select(selector)
                .Distinct()
                .ToListAsync();
        }

        public virtual async Task<decimal> SumAsync(Expression<Func<T, bool>> expression, Expression<Func<T,decimal>> selector) 
        {
            return await _dbSet.Where(expression).SumAsync(selector);
        }
        
    }
}
