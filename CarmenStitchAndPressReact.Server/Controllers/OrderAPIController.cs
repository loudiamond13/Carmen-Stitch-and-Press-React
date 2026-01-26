using CSP.React.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarmenStitchAndPressReact.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/order")]
    public class OrderAPIController : ControllerBase
    {
       

        [HttpPost]
        [Route("index")]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
