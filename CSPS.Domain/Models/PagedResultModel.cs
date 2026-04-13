using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Models
{
    public class PagedResultModel<TEntity>
    {
        public List<TEntity> Data { get; set; } = new List<TEntity>();
        public int TotalCount { get; set; }
    }
}
