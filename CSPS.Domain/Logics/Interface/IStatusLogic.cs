using CSPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IStatusLogic
    {
        Task<string?> GetStatusNameByIdAsync(int id);
        Task<List<Status>> GetAllStatusesAsync();
    }
}
