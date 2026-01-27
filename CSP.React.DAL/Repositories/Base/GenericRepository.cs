using CSP.React.DAL.DbContexts;
using CSP.React.Domain.IRepositories.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CSP.React.DAL.Repositories.Base
{
    public abstract class GenericRepository<C, T> : IGenericRepository<T>
        where T : class
        where C : DbContext
    {
        protected readonly C _context;
        protected readonly DbSet<T> _dbSet;
        protected GenericRepository(C context)
        {
            _context = context?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public virtual async Task<T?> GetAsync(Expression<Func<T, bool>> expression, Func<IQueryable<T>, IQueryable<T>>? includeBuilder = null)
        {
            IQueryable<T> query = _context.Set<T>();
            if (includeBuilder != null)
            {
                query = includeBuilder(query);
            }
            return await query.FirstOrDefaultAsync(expression);
        }

        public virtual async Task<List<T>> FindByAsync(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includeBuilder)
        {
            IQueryable<T> queryable = _context.Set<T>();

            foreach (var include in includeBuilder)
            {
                queryable = queryable.Include(include);
            }

            return await queryable.Where(expression).ToListAsync();
        }

        public virtual async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}
