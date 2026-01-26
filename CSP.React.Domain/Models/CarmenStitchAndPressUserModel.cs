
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSP.React.Domain.Models
{
    public class CarmenStitchAndPressUserModel: IdentityUser
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
