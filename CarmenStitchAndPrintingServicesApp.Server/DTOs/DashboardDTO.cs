namespace CarmenStitchAndPrintingServicesApp.Server.DTOs
{
    public class DashboardDTO
    {
        public decimal TotalRevenue { get; set; }    //orders total amt
        public decimal TotalExpenses { get; set; }   //costs
        public decimal TotalPayments { get; set; }   //total received
        public decimal NetProfit => TotalRevenue - TotalExpenses;    //Revenue - Expenses
        public decimal Uncollected => TotalRevenue - TotalPayments;  //Revenue - Payments
        public double ExpenseRatio => (double)(TotalRevenue > 0 ? (TotalExpenses / TotalRevenue) * 100 : 0); // (Expenses / Revenue) * 100

        public double MarginPercentage => (double)(TotalRevenue > 0 ? (NetProfit / TotalRevenue) * 100 : 0);

    }
}
