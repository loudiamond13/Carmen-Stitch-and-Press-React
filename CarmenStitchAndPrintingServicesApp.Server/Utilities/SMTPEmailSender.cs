using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net.Mail;

namespace CarmenStitchAndPrintingServicesApp.Server.Utilities
{
    public class SMTPEmailSender :IEmailSender
    {
        private readonly IConfiguration _configuration;
        public SMTPEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task  SendEmailAsync(string emailTo, string subject, string htmlMessage)
        {
            string smtopHost = _configuration["SMTP:Host"] ?? throw new InvalidOperationException("SMTP Host is not configured.");
            int smtpPort = int.TryParse(_configuration["SMTP:Port"], out int port) ? port : throw new InvalidOperationException("SMTP Port is not configured or invalid.");
            string smtpUser = _configuration["SMTP:Username"] ?? throw new InvalidOperationException("SMTP Username is not configured.");
            string smtpPass = _configuration["SMTP:Password"] ?? throw new InvalidOperationException("SMTP Password is not configured.");

            var client = new SmtpClient(smtopHost, smtpPort)
            {
                Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUser),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true,
                To = { new MailAddress(emailTo) }
            };

            return client.SendMailAsync(mailMessage);
        }
    }
}
