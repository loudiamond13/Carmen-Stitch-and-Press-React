using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CSPS.Domain.Models
{
    public class CSPSUserModel: IdentityUser
    {
        public string? LoginVerificationCode { get; set; }
        public DateTime? CodeSentAt { get; set; }


        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        [NotMapped]
        public string FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }
        [NotMapped]
        public string Role { get; set; } = string.Empty;
        [NotMapped]
        public decimal MoneyOnHand { get; set; } = 0;
    }
}
