using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CSP.React.Domain.IRepositories.Base
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetAsync(Expression<Func<T, bool>> expression, Func<IQueryable<T>, IQueryable<T>>? includeBuilder = null);
        Task<List<T>> FindByAsync(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes);

        Task AddAsync(T entity);

        Task SaveAsync();
        void Delete(T entity);
    }
}
