using CSPS.Domain.Logics.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarmenStitchAndPrintingServicesApp.Server.Controllers.User
{
    [ApiController]
    [Authorize(Roles ="Admin,Company")]
    [Route("api/user")]
    public class UserAPIController : ControllerBase
    {
        private readonly IUserLogic _userLogic;


        public UserAPIController(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }

        #region get all admin users
        [HttpGet]
        [Route("get-all-admin-users")]
        public async Task<IActionResult> GetAllAdminUsers()
        {
            var users = await _userLogic.GetAllAdminUsers();
            return Ok(users);
        }
        #endregion
    }
}
