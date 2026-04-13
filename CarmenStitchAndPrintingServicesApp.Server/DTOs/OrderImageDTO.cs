namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class OrderImageDTO
    {
        public int ImageId { get; set; }

        public int OrderId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;

    }
}
