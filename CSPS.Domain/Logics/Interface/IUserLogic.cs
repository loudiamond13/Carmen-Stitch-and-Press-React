using CSPS.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics.Interface
{
    public interface IUserLogic
    {
        public Task<List<CSPSUserModel>> GetAllAdminUsers();
    }
}
