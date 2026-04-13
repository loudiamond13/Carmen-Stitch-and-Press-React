using CSPS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace CSPS.Domain.QueryExtensions
{
    public static class QueryableSortExtensions
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, List<SortModel> sorts) 
        {
            if (sorts == null || sorts.Count == 0) 
                return query;

            bool first = true; 
            foreach (var sort in sorts) 
            {
                string propertyName = sort.Id;
                var parameter = Expression.Parameter(typeof(T), "x"); 
                var property = Expression.Property(parameter, propertyName); 
                var lambda = Expression.Lambda(property, parameter); 
                string methodName; 
                if (first) { methodName = sort.Desc ? "OrderByDescending" : "OrderBy"; 
                    first = false; 
                } 
                else 
                {
                    methodName = sort.Desc ? "ThenByDescending" : "ThenBy"; 
                } 
                query = typeof(Queryable).GetMethods()
                    .First(m => m.Name == methodName && m.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(T), property.Type)
                    .Invoke(null, new object[] { query, lambda }) as IQueryable<T>; 
            } 
            return query; 
        }
    }
}
