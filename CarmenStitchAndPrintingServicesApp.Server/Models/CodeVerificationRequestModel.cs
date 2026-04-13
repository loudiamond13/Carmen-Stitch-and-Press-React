using System.ComponentModel.DataAnnotations;

namespace CarmenStitchAndPrintingServicesApp.Server.Models
{
    public class CodeVerificationRequestModel
    {
        [Required]
        public string Code { get; set; } = "";
        [Required]
        public string Email { get; set; } = "";
        public bool RememberMe { get; set; }
    }
}
