using CarmenStitchAndPrintingServicesApp.Server.DTOs;
using CarmenStitchAndPrintingServicesApp.Server.Models;
using CarmenStitchAndPrintingServicesApp.Server.Utilities;
using CloudinaryDotNet.Actions;
using CSPS.Domain.Entities;
using CSPS.Domain.Exceptions;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.Pkcs;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CarmenStitchAndPrintingServicesApp.Server.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = "Admin,Company")]
    [Route("api/order")]
    public class OrderAPIController : ControllerBase
    {
        private readonly IOrderLogic _orderLogic;
        private readonly IStatusLogic _statusLogic;
        private readonly IOrderTypeLogic _orderTypeLogic;
        private readonly IPaymentLogic _paymentLogic;
        private readonly IOrderItemLogic _orderItemLogic;
        private readonly IDiscountLogic _discountLogic;
        private readonly IExpenseLogic _expenseLogic;
        private readonly IOrderImageLogic _orderImageLogic;
        private readonly CloudinaryService _cloudinaryService;

        public OrderAPIController(
            IOrderLogic orderLogic,
            IStatusLogic statusLogic,
            IOrderTypeLogic orderTypeLogic,
            CloudinaryService cloudinaryService,
            IPaymentLogic paymentLogic,
            IOrderItemLogic orderItemLogic,
            IDiscountLogic discountLogic,
            IExpenseLogic expenseLogic,
            IOrderImageLogic orderImageLogic
            )
        {
            _orderLogic = orderLogic;
            _statusLogic = statusLogic; 
            _orderTypeLogic = orderTypeLogic;
            _cloudinaryService = cloudinaryService;
            _paymentLogic = paymentLogic;
            _orderItemLogic = orderItemLogic;
            _discountLogic = discountLogic;
            _expenseLogic = expenseLogic;
            _orderImageLogic = orderImageLogic;

        }

        #region get orders (with filter/no filter) paged
        [HttpGet]
        [Route("getOrders")]
        public async Task<IActionResult> GetOrders([FromQuery] QueryParamsModel queryParams)
        {
            var orders = await _orderLogic.GetOrdersAsync(
                                    queryParams.PageNumber, 
                                    queryParams.PageSize,
                                    queryParams.Filters,
                                    queryParams.Sort
                                );



            return Ok(new
            {
                data = orders.Data, //array of orders
                pageNum = queryParams.PageNumber,
                pageSize = queryParams.PageSize,
                totalCount = orders.TotalCount,
                pageCount = (int)Math.Ceiling((double)orders.TotalCount / queryParams.PageSize)
            }
            );
        }
        #endregion


        #region Get all statuses
        [HttpGet]
        [Route("get-all-order-statuses")]
        public async Task<IActionResult> GetAllStatuses() 
        {
            var statuses = await _statusLogic.GetAllStatusesAsync();
            return Ok(statuses);
        }
        #endregion
        #region get all order types
        [HttpGet]
        [Route("get-all-order-types")]
        public async Task<IActionResult> GetAllOrderTypes() 
        {
            var orderTypes = await _orderTypeLogic.GetAllOrderTypes();
            return Ok(orderTypes);
        }
        #endregion

        #region create order
        [HttpPost]
        [Route("create-order")]
        public async Task<IActionResult> CreateOrder(
            [FromForm] string order, 
            [FromForm] IFormFile[] images) 
        {

            var orderDTO = JsonSerializer.Deserialize<OrderDTO>(
                         order,
                         new JsonSerializerOptions
                         {
                             PropertyNameCaseInsensitive = true,
                             NumberHandling = JsonNumberHandling.AllowReadingFromString
                         });

            //manual validation
            var validationContext = new ValidationContext(orderDTO);
            var validationResults = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(orderDTO, validationContext, validationResults,true);

            if (!isValid) 
            {
                return BadRequest(new
                {
                    errors = validationResults.Select(x => x.ErrorMessage)
                });
            }

            if (images.Length > 0) 
            {
                foreach (var image in images)
                {
                    var uploadResult = await _cloudinaryService.UploadImageAsync(image);
                    if (uploadResult != null)
                    {
                        orderDTO.OrderImages.Add(new OrderImageDTO
                        {
                            ImageUrl = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId
                        });
                    }
                }
            }


            await _orderLogic.CreateOrderAsync(orderDTO.ToEntity());
            return Ok(new { 
                message = "Order created successfully."
            });
        }
        #endregion

        #region update order
        [HttpPatch]
        [Route("update-order")]
        public async Task<IActionResult> UpdateOrder(
            [FromForm] string order,
            [FromForm] IFormFile[] images
            )
        {
            try
            {
                var orderDTO = JsonSerializer.Deserialize<OrderDTO>(order, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    NumberHandling = JsonNumberHandling.AllowReadingFromString
                });

                var validationCtx = new ValidationContext(orderDTO);
                var validationRes = new List<ValidationResult>();

                if (!Validator.TryValidateObject(orderDTO, validationCtx, validationRes)) 
                {
                    return BadRequest(new{
                        errors = validationRes.Select(x => x.ErrorMessage)
                    });
                }

                if (images.Length > 0 && images != null) 
                {
                    //delete old images (temp way only)
                    if (orderDTO.OrderImages.Count > 0 && orderDTO.OrderImages.Any())
                    {
                        var existingImgs = orderDTO.OrderImages.ToList();
                        foreach (var oldImage in existingImgs) 
                        {
                            var result = await _cloudinaryService.DeleteImageAsync(oldImage.PublicId);

                            if (result.Result == "ok" || result.Result == "not found")
                            {
                                //delete from DB record
                                await _orderImageLogic.DeleteOrderImageAsync(oldImage.ImageId);

                                //remove from our DTO list so it's not sent to UpdateOrderAsync
                                orderDTO.OrderImages.Remove(oldImage);
                            }
                        }
                    }

                    foreach (var img in images) 
                    {
                        var imgUploadRes = await _cloudinaryService.UploadImageAsync(img);
                        if (imgUploadRes != null)
                        {
                            orderDTO.OrderImages.Add(new OrderImageDTO
                            {
                                ImageUrl = imgUploadRes.SecureUrl.AbsoluteUri,
                                PublicId = imgUploadRes.PublicId,
                            });
                        }
                    }
                }

                await _orderLogic.UpdateOrderAsync(orderDTO.ToEntity());

                return Ok(new {
                    message = "Order updated successfully."
                });

            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region get order by id
        [HttpGet]
        [Route("get-order-by-id/{id}")]
        public async Task<IActionResult> GetOrderById(int id) 
        {
            var order = await _orderLogic.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(OrderDTO.FromEntity(order));
        }
        #endregion

        #region
        [HttpGet]
        [Route("get-cloudinary-signature")]
        public IActionResult GetCloudinarySignature() 
        {
            var signatureData = _cloudinaryService.GenerateUploadSignature();
            return Ok(signatureData);
        }
        #endregion

        #region create order payment
        [HttpPost]
        [Route("create-order-payment")]
        public async Task<IActionResult> CreateOrderPayment(PaymentDTO paymentDTO) 
        {
           
            await _paymentLogic.CreatePaymentAsync(paymentDTO.ToEntity());
            return Ok(new
            {
                message = "Payment created successfully."
            });
           
        }
        #endregion

        #region create/add order item to existing order
        [HttpPost]
        [Route("create-order-item")]
        public async Task<IActionResult> CreateOrderItem(OrderItemDTO orderItemDTO)
        {
           
            await _orderItemLogic.CreateOrderItemAsync(orderItemDTO.ToEntity());
            return Ok(new { 
                message="Order item created successfully."
            });
            
        }
        #endregion

        #region add order discount
        [HttpPost]
        [Route("create-order-discount")]
        public async Task<IActionResult> CreateOrderDiscount(DiscountDTO discountDTO) 
        {
            try
            {
                await _discountLogic.CreateOrderDiscountAsync(discountDTO.ToEntity());
                return Ok(new { 
                    message = "Order discount created successfully."
                });
            }
            catch (BusinessRuleException ex) 
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region add/create order expense
        [HttpPost]
        [Route("create-order-expense")]
        public async Task<IActionResult> CreateOrderExpense(ExpenseDTO expenseDTO) 
        {
            try
            {
                await _expenseLogic.CreateOrderExpenseAsync(expenseDTO.ToEntity());
                return Ok(new { 
                    message = "Order expense created successfully."
                });
            }
            catch (BusinessRuleException ex) 
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region create company expense async
        [HttpPost]
        [Route("create-company-expense")]
        public async Task<IActionResult> CreateCompanyExpense([FromBody] ExpenseDTO expense)
        {
            try
            {
                await _expenseLogic.CreateCompanyExpenseAsync(expense.ToEntity());

                return Ok(new
                {
                    message = "Created company expense successfully."
                });
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region get expenses
        [HttpGet]
        [Route("get-expenses")]
        public async Task<IActionResult> GetExpenses([FromQuery] QueryParamsModel queryParamsModel) 
        {
            var expenses = await _expenseLogic.GetExpensesAsync(
                    queryParamsModel.PageNumber,
                    queryParamsModel.PageSize,
                    queryParamsModel.Filters,
                    queryParamsModel.Sort
                );

            return Ok(new 
            {
                data = expenses.Data,
                pageNum = queryParamsModel.PageNumber,
                pageSize = queryParamsModel.PageSize,
                totalCount = expenses.TotalCount,
                pageCount = (int)Math.Ceiling((double)expenses.TotalCount / queryParamsModel.PageSize)
            });
        }
        #endregion

        #region delete order payment async
        [HttpDelete]
        [Route("delete-order-payment")]
        public async Task<IActionResult> DeleteOrderPayment(int paymentId) 
        {
            try
            {
               
                await _paymentLogic.DeleteOrderPaymentByIdAsync(paymentId);
                return Ok(new { 
                    message="Order payment deleted successfully."
                });
            }
            catch (BusinessRuleException ex) 
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region delete order item async
        [HttpDelete]
        [Route("delete-order-item")]
        public async Task<IActionResult> DeleteOrderItem(int orderItemId) 
        {
            try
            {
                
                await _orderItemLogic.DeleteOrderItemByIdAsync(orderItemId);
                return Ok(new {message="Order item deleted successfully."});
            }
            catch (BusinessRuleException ex) 
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region delete order discount
        [HttpDelete]
        [Route("delete-order-discount")]
        public async Task<IActionResult> DeleteOrderDiscount(int discountId) 
        {
            try
            {

                await _discountLogic.DeleteOrderDiscountAsync(discountId);
                return Ok(new { 
                    message="Order discount deleted successfully."
                });
            }
            catch (BusinessRuleException ex) 
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region delete expense async
        [HttpDelete]
        [Route("delete-expense")]
        public async Task<IActionResult> DeleteExpense(int expenseId)
        {
            try
            {
                await _expenseLogic.DeleteExpenseAsync(expenseId);

                return Ok(new 
                {
                    message="Expense deleted successfully."
                });
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion


        #region Update Order Payment
        [HttpPatch]
        [Route("update-order-payment")]
        public async Task<IActionResult> UpdateOrderPaymentAsync([FromBody]PaymentDTO payment)
        {
            try
            {
                await _paymentLogic.UpdateOrderPaymentAsync(payment.ToEntity());

                return Ok(new
                {
                    message = "Order payment updated successfully"
                });
                
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region update order item
        [HttpPatch]
        [Route("update-order-item")]
        public async Task<IActionResult> UpdateOrderItem([FromBody] OrderItemDTO orderItemDTO)
        {
            try
            {
                await _orderItemLogic.UpdateOrderItemAsync(orderItemDTO.ToEntity());

                return Ok(new 
                { 
                    message = "Order item updated successfully."
                });
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion


        #region update expense async
        [HttpPatch]
        [Route("update-expense")]
        public async Task<IActionResult> UpdateExpense([FromBody] ExpenseDTO expenseDTO)
        {
            try
            {

                await _expenseLogic.UpdateExpenseAsync(expenseDTO.ToEntity());

                return Ok(new
                {
                    message = "Expense updated successfully."
                });
            }
            catch (BusinessRuleException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region update order discount async
        [HttpPatch]
        [Route("update-order-discount")]
        public async Task<IActionResult> UpdateOrderDiscount([FromBody] DiscountDTO discountDTO)
        {
            await _discountLogic.UpdateOrderDiscountAsync(discountDTO.ToEntity());
            return Ok(new { 
                message = "Order discount updated successfully."
            });
        }
        #endregion



    }
}
