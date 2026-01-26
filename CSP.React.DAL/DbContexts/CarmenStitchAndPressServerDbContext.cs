using CSP.React.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CSP.React.DAL.DbContexts
{
    public class CarmenStitchAndPressServerDbContext : IdentityDbContext<CarmenStitchAndPressUserModel>
    {
        public CarmenStitchAndPressServerDbContext(DbContextOptions<CarmenStitchAndPressServerDbContext> options):base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
