using CSPS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace CSPS.Domain.QueryExtensions
{
    public static class QueryableFilterExtensions
    {
        public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, List<FilterModel> filters) 
        { 

            

            if (filters == null || filters.Count == 0) 
                return query;
            
            foreach (var filter in filters) 
            {
                string propertyName = filter.Id;
                //var parameter = Expression.Parameter(typeof(T), "x"); 
                //var property = Expression.Property(parameter, propertyName);
                //var constant = Expression.Constant(Convert.ChangeType(filter.Value, property.Type));

                var parameter = Expression.Parameter(typeof(T), "x");
                var property = Expression.Property(parameter, propertyName);

                var targetType = Nullable.GetUnderlyingType(property.Type) ?? property.Type;
                object convertedValue;// = Convert.ChangeType(filter.Value, targetType);

                if (targetType == typeof(DateTime))
                {
                    var ms = Convert.ToInt64(filter.Value);
                    var date = DateTimeOffset.FromUnixTimeMilliseconds(ms).UtcDateTime.Date;

                    //convertedValue = DateTimeOffset.FromUnixTimeMilliseconds(ms).Date;

                    if (filter.Operator == "<") 
                    {
                        convertedValue = date.AddDays(1);
                        //filter.Operator = "<"; // change operator
                    }
                    else
                    {
                        convertedValue = date;
                    }
                }
                else
                {
                    convertedValue = Convert.ChangeType(filter.Value, targetType);
                }

                var constant = Expression.Constant(convertedValue, property.Type);

                Expression? body = filter.Operator.ToLower() switch 
                { 
                    "=" => Expression.Equal(property, constant), 
                    ">" => Expression.GreaterThan(property, constant), 
                    "<" => Expression.LessThan(property, constant), 
                    ">=" => Expression.GreaterThanOrEqual(property, constant), 
                    "<=" => Expression.LessThanOrEqual(property, constant), 
                    "contains" => Expression.Call(property, "Contains", null, constant), 
                    "startswith" => Expression.Call(property, "StartsWith", null, constant), 
                    "endswith" => Expression.Call(property, "EndsWith", null, constant), 
                    _ => throw new NotSupportedException($"Operator {filter.Operator} not supported") 
                }; 
                
                var lambda = Expression.Lambda<Func<T, bool>>(body, parameter); 
                query = query.Where(lambda); 
            } 

            return query; 
        }
    }
}
