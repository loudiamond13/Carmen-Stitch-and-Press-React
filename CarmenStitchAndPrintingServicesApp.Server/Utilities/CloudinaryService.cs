using CarmenStitchAndPrintingServicesApp.Server.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using System.Collections;

namespace CarmenStitchAndPrintingServicesApp.Server.Utilities
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly string _uploadFolder;
        public CloudinaryService(IOptions<CloudinarySettingsModel> options, IConfiguration configuration)
        {
            var account = new Account(
                options.Value.CloudName,
                options.Value.ApiKey,
                options.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
            _uploadFolder = configuration["CloudinarySettings:UploadFolder"] ?? "Orders";
        }

        public async Task<ImageUploadResult> UploadImageAsync(IFormFile file, string? folder = null)
        {
            if (file.Length == 0) return null;

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _uploadFolder
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result;
        }

        public Dictionary<string, object> GenerateUploadSignature(string? folder = null)
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var signatureParams = new SortedDictionary<string, object>
            {
                { "folder", _uploadFolder },
                { "timestamp", timestamp }
            };
            var signature = _cloudinary.Api.SignParameters(signatureParams);
            return new Dictionary<string, object>
            {
                { "signature", signature },
                { "timestamp", timestamp },
                {"cloudName", _cloudinary.Api.Account.Cloud },
                {"apiKey", _cloudinary.Api.Account.ApiKey }
            };
        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId) 
        {
            if (string.IsNullOrEmpty(publicId)) return null;

            var deletionParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deletionParams);

            return result;
        }
    }
}
