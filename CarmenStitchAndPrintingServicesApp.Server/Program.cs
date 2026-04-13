using CarmenStitchAndPrintingServicesApp.Server.Models;
using CarmenStitchAndPrintingServicesApp.Server.Utilities;
using CSPS.DAL.DbContexts;
using CSPS.DAL.Interceptors;
using CSPS.DAL.Repositories;
using CSPS.Domain.IRepositories;
using CSPS.Domain.Logics;
using CSPS.Domain.Logics.Interface;
using CSPS.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("CSPConnectionString") ?? 
                        throw new InvalidOperationException("Connection string 'CSPConnectionString' not found.");

var provider = builder.Configuration.GetSection("ConnectionStrings")
    .GetReloadToken(); // This is just to access the configuration structure

builder.Services.AddDbContext<CSPSDbContext>((serviceProvide, options) =>{

    var interceptor = serviceProvide.GetRequiredService<OrderAuditAndTotalInterceptor>();
    options.UseSqlServer(connectionString).AddInterceptors(interceptor);
});

builder.Services.AddIdentity<CSPSUserModel, IdentityRole>(opt => {
    opt.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<CSPSDbContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<CloudinarySettingsModel>(
        builder.Configuration.GetSection("CloudinarySettings")
    );
builder.Services.AddSingleton<CloudinaryService>();

// Add services to the container.
builder.Services.AddTransient<IEmailSender, SMTPEmailSender>();
builder.Services.AddScoped<OrderAuditAndTotalInterceptor>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IStatusRepository, StatusRepository>();
builder.Services.AddScoped<IOrderTypeRepository, OrderTypeRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IOrderItemRepository, OrderItemRepository>();
builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<IOrderImageRepository, OrderImageRepository>();

builder.Services.AddScoped<IOrderLogic, OrderLogic>();
builder.Services.AddScoped<IStatusLogic, StatusLogic>();
builder.Services.AddScoped<IUserLogic, UserLogic>();
builder.Services.AddScoped<IOrderTypeLogic, OrderTypeLogic>();
builder.Services.AddScoped<IPaymentLogic, PaymentLogic>();
builder.Services.AddScoped<IOrderItemLogic, OrderItemLogic>();
builder.Services.AddScoped<IDiscountLogic, DiscountLogic>();
builder.Services.AddScoped<IExpenseLogic, ExpenseLogic>();
builder.Services.AddScoped<IOrderImageLogic, OrderImageLogic>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
// Add authentication services
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Domain = ".csptailoring.com";
    options.Cookie.Name = "CSPS"; 
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.LoginPath = "/Identity/Login";           // optional
    options.LogoutPath = "/Identity/Logout";         // optional
    //options.ExpireTimeSpan = TimeSpan.FromDays(7);  // cookie lifetime
    options.SlidingExpiration = true;              // auto-refresh expiration
});

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});



// Add Rate Limiting Service
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("AuthPolicy", httpContext =>
   RateLimitPartition.GetSlidingWindowLimiter(
       partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
       factory: partition => new SlidingWindowRateLimiterOptions
       {
           PermitLimit = 5,
           Window = TimeSpan.FromMinutes(1),
           SegmentsPerWindow = 6,
           AutoReplenishment = true
       }));

    // Custom response when a user is rate-limited
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsync("Too many attempts. Please try again in a minute.", token);
    };

   
});

if (builder.Environment.IsProduction())
{
    Console.WriteLine("Confirmed: Running in Production mode.");
}



var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseForwardedHeaders();
// 1. Core Networking & Security
app.UseHttpsRedirection();

// 2. Routing (Must happen before CORS and Auth)
app.UseRouting();
// 3. CORS (Must be after UseRouting so it knows which endpoint is being hit)
app.UseCors("ProductionPolicy");
app.UseRateLimiter();




// 4. Static Files (These usually don't need Auth, so put them before)
app.UseDefaultFiles();
app.MapStaticAssets();

// 5. Authentication & Authorization (Always in this order)
app.UseAuthentication();
app.UseAuthorization();

// 6. Endpoints (Controllers and API tools)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
