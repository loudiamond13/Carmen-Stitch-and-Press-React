using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;

namespace CarmenStitchAndPressReact.Server.Utilities
{
  

    public class SmtpEmailSender:IEmailSender
    {
        private readonly IConfiguration _configuration;
        public SmtpEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPort = int.Parse(_configuration["Smtp:Port"]);
            var smtpUser = _configuration["Smtp:Username"];
            var smtpPass = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:FromEmail"] ?? "";

            var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage(fromEmail, email, subject, htmlMessage)
            {
                IsBodyHtml = true
            };

            // mailMessage.CC.Add(fromEmail);

            return client.SendMailAsync(mailMessage);
        }

    }
}
