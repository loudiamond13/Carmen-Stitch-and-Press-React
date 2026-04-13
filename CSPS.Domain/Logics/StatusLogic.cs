using CSPS.Domain.Entities;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class StatusLogic:IStatusLogic
    {
        private readonly IStatusRepository _statusRepository;
        public StatusLogic(IStatusRepository statusRepository)
        {
            _statusRepository = statusRepository;
        }

        public async Task<string?> GetStatusNameByIdAsync(int id) 
        {
            Status? status = await _statusRepository.GetAsync(x => x.StatusId == id);

            if (status is not null) 
            {
                return status.StatusName;
            }

            return null;

        }

        public async Task<List<Status>> GetAllStatusesAsync() 
        {
            return await _statusRepository.GetAllAsync();
        }
    }
}
