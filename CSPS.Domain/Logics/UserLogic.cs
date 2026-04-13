using CSPS.Domain.Logics.Interface;
using CSPS.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Logics
{
    public class UserLogic: IUserLogic
    {
        private readonly UserManager<CSPSUserModel> _userManager;


        public UserLogic(UserManager<CSPSUserModel> userManager)
        {
            _userManager = userManager;
        }
        public async Task<List<CSPSUserModel>> GetAllAdminUsers()
        {

            var admins = await _userManager.GetUsersInRoleAsync("Admin");

            return admins.Select(x => new CSPSUserModel
            {
                Id = x.Id,
                Email = x.Email,
                UserName = x.UserName,
                FirstName = x.FirstName,
                LastName = x.LastName,
            }).ToList();
        }
    }
}
