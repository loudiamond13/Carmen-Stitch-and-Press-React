using CarmenStitchAndPrintingServicesApp.Server.DTOs;
using CSPS.Domain.Logics.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarmenStitchAndPrintingServicesApp.Server.Controllers
{
    [ApiController]
    [Route("api/home")]
    public class HomeAPIController : ControllerBase
    {

        private readonly IOrderLogic _orderLogic;
        private readonly IExpenseLogic _expenseLogic;
        private readonly IPaymentLogic _paymentLogic;
        public HomeAPIController(IOrderLogic orderLogic, IExpenseLogic expenseLogic, IPaymentLogic paymentLogic)
        {
            _orderLogic = orderLogic;
            _expenseLogic = expenseLogic;
            _paymentLogic = paymentLogic;
        }


        #region admin dashboard [HttpGet] 
        [HttpGet]
        [Authorize(Roles = "Admin,Company")]
        [Route("authorized-home")]
        public async Task<IActionResult> AuthorizedHome(int year = 0)
        {

            var years = await _orderLogic.GetDistinctYearsAsync();
            var totalExpense = await _expenseLogic.GetTotalExpensesAsync(year);
            var allOrdersTotalAmt = await _orderLogic.GetAllOrderTotalAsync(year);
            var totalPayments = await _paymentLogic.GetTotalPaymentsAsync(year);


            var dashboard = new DashboardDTO
            {
                TotalRevenue = allOrdersTotalAmt,
                TotalExpenses = totalExpense,
                TotalPayments = totalPayments
            };

            return Ok(new
            {
                years,
                dashboard
            });
        }
        #endregion
    }
}
