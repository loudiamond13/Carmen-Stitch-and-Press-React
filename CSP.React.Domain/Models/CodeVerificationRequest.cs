using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSP.React.Domain.Models
{
    public class CodeVerificationRequest
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public string Email { get; set; }
        public bool RememberMe { get; set; }
    }
}
