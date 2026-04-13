using CSPS.Domain.Models;


namespace CarmenStitchAndPrintingServicesApp.Server.Models
{
    public class QueryParamsModel
    {
        public List<FilterModel> Filters { get; set; } = new();
        public List<SortModel> Sort { get; set; } = new();
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10; 
    }
}
