using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CSP.React.DAL.DbContexts;
using System.Configuration;
using CSP.React.Domain.Models;
using CarmenStitchAndPressReact.Server.Utilities;
using Microsoft.AspNetCore.Identity.UI.Services;


var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("CarmenStitchAndPressReactServerContextConnection") ?? 
                            throw new InvalidOperationException("Connection string 'CarmenStitchAndPressReactServerContextConnection' not found.");

builder.Services.AddDbContext<CarmenStitchAndPressServerDbContext>(options =>
    options.UseSqlServer(connectionString)
);

builder.Services.AddIdentity<CarmenStitchAndPressUserModel, IdentityRole>()
                .AddEntityFrameworkStores<CarmenStitchAndPressServerDbContext>();


builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.ExpireTimeSpan = TimeSpan.FromDays(365);
    options.SlidingExpiration = false;


    options.AccessDeniedPath = "/";
    options.LoginPath = "/";
});


var app = builder.Build();
//app.MapIdentityApi<CarmenStitchAndPressUserModel>();
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
