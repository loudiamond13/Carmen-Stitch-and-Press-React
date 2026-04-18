using CarmenStitchAndPrintingServicesApp.Server.Models;
using CSPS.Domain.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.RateLimiting;

namespace CarmenStitchAndPrintingServicesApp.Server.Controllers.Identity
{
    [ApiController]
    [Route("api/identity")]
    public class IdentityAPIController : ControllerBase
    {
        private readonly UserManager<CSPSUserModel> _userManager;
        private readonly SignInManager<CSPSUserModel> _signInManager;
        private readonly IEmailSender _emailSender;

        public IdentityAPIController(
            UserManager<CSPSUserModel> userManager,
            SignInManager<CSPSUserModel> signInManager,
            IEmailSender emailSender
            )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _emailSender = emailSender;
        }

        #region Register
        [Authorize(Roles = "Company")]
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestModel registerRequest)
        {
            var user = new CSPSUserModel
            {
                UserName = registerRequest.Email,
                Email = registerRequest.Email,
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { message = "User registered successfully" });
        }
        #endregion

        #region Log In
        [HttpPost]
        [Route("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> LogIn([FromBody] LoginRequestModel loginRequest)
        {
            try
            {
                if (!string.IsNullOrEmpty(loginRequest.Email.Trim()) && !string.IsNullOrEmpty(loginRequest.Password.Trim()))
                {
                    var result = await _signInManager.PasswordSignInAsync(loginRequest.Email, loginRequest.Password, loginRequest.RememberMe, false);

                    if (result.Succeeded)
                    {
                        //get user
                        var user = await _userManager.FindByEmailAsync(loginRequest.Email);

                        //6 random digits for verification
                        var code = new Random().Next(100000, 999999).ToString();

                        var code1 = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

                        //avoid sending code twice if there is already one that is not expired (10mins)
                        if (user.CodeSentAt is null || user.CodeSentAt < DateTime.UtcNow.AddMinutes(-10))
                        {
                            user.LoginVerificationCode = code1;
                            user.CodeSentAt = DateTime.UtcNow;
                            await _userManager.UpdateAsync(user);

                            await _emailSender.SendEmailAsync(
                                user.Email,
                                "Login Verification Code",
                                $"Your login verification code is <strong>{code1}</strong>."
                                );

                        }

                        await _signInManager.SignOutAsync();
                        return Ok(new { Email = loginRequest.Email, RememberMe = loginRequest.RememberMe });
                    }
                    return BadRequest(new { message = "Invalid Email or Password." });
                }
                else
                {
                    return BadRequest(new { message = "Invalid Email or Password." });
                }
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Invalid Email or Password." });
            }
        }
        #endregion


        #region get current user
        [HttpGet]
        [Route("current-user")]
        public async Task<IActionResult> CurrentUser()
        {
            try
            {
                if (User.Identity?.IsAuthenticated != true)
                {
                    return Ok(null);
                }

                var userName = User.Identity?.Name ?? "";

                var currentUser = await _userManager.FindByEmailAsync(userName);
                if (currentUser is not null)
                {
                    var roles = await _userManager.GetRolesAsync(currentUser);


                    return Ok(new
                    {
                        firstName = currentUser.FirstName,
                        username = userName,
                        roles = roles
                    });
                }

                return Ok(null);
            }
            catch (Exception)
            {
                return BadRequest(new { message = "No current user." });
            }
        }
        #endregion

        #region log out
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                if (User != null && User.Identity.IsAuthenticated)
                {
                    await _signInManager.SignOutAsync();
                    return Ok();
                }
                return BadRequest("No user is logged in.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion
        #region code verification
        [HttpPost]
        [Route("verify-code")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> VerifyCode([FromBody] CodeVerificationRequestModel codeVerificationRequest)
        {
            try
            {
                if (!string.IsNullOrEmpty(codeVerificationRequest.Email) && !string.IsNullOrEmpty(codeVerificationRequest.Code))
                {
                    var user = await _userManager.FindByEmailAsync(codeVerificationRequest.Email);
                    if (user == null || user.LoginVerificationCode != codeVerificationRequest.Code)
                    {
                        return BadRequest("Invalid verification code.");
                    }

                    if (user.CodeSentAt == null || user.CodeSentAt < DateTime.UtcNow.AddMinutes(-10))
                    {
                        return BadRequest("Verification code has expired.");
                    }

                    //clear the code and sign in
                    user.LoginVerificationCode = null;
                    user.CodeSentAt = null;
                    await _userManager.UpdateAsync(user);



                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = codeVerificationRequest.RememberMe,
                        ExpiresUtc = codeVerificationRequest.RememberMe ? DateTime.UtcNow.AddDays(60) : null,
                        AllowRefresh = true,
                        IssuedUtc = DateTime.UtcNow
                        
                    };

                    await _signInManager.SignInAsync(user, authProperties, IdentityConstants.ApplicationScheme);

                    // Ensure the cookie reflects the latest security stamp
                    await _signInManager.RefreshSignInAsync(user);

                    return Ok();
                }
                return BadRequest("Invalid Code");
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong.");
            }
        }
        #endregion

        #region Forgot Password
        [HttpPost]
        [Route("forgotPassword")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {

            try 
            {
                var genericResponse = "If an account exists for that email, a reset link has been sent.";

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                {
                    return Ok(new { message = genericResponse });
                }


                string token = await _userManager.GeneratePasswordResetTokenAsync(user);
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                // 3. Build callback
                var callbackUrl = $"{Request.Scheme}://{Request.Host}/reset-password?code={token}&email={WebUtility.UrlEncode(email)}";

                await _emailSender.SendEmailAsync(email, "Reset Password", $"Click <a href='{callbackUrl}'>here</a>.");

                return Ok(new { message = genericResponse });
            }
            catch (Exception) 
            {
                return BadRequest("Something went wrong.");
            }
        }
        #endregion
    }
}
