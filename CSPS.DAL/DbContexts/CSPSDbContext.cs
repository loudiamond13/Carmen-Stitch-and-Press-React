using CSPS.Domain.Entities;
using CSPS.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace CSPS.DAL.DbContexts
{
    public partial class CSPSDbContext:IdentityDbContext<CSPSUserModel>
    {
        public CSPSDbContext(DbContextOptions<CSPSDbContext> options):base(options)
        {
            
        }

        public virtual DbSet<Discount> Discounts { get; set; }

        public virtual DbSet<Expense> Expenses { get; set; }

        public virtual DbSet<MoneyTransfer> MoneyTransfers { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<OrderItem> OrderItems { get; set; }

        public virtual DbSet<OrderType> OrderTypes { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<Status> Statuses { get; set; }
        public virtual DbSet<OrderImage> OrderImages { get; set; }
        public virtual DbSet<CSPSUserModel> CSPSUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Discount>(entity =>
            {
                entity.HasKey(e => e.OrderDiscountId).HasName("PK__Discount__5EF1877EF77DDDE4");

                entity.Property(e => e.Amount).HasColumnType("money");
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.DiscountDate).HasColumnType("datetime");
                entity.Property(e => e.DiscountedBy)
                    .IsRequired()
                    .HasMaxLength(30);
                entity.Property(e => e.UpdateDate).HasColumnType("datetime");
                entity.Property(e => e.UpdatedBy).HasMaxLength(30);

                entity.HasOne(d => d.Order).WithMany(p => p.Discounts)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Discounts__Updat__6477ECF3");
            });

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.ExpenseId).HasName("PK__Expenses__DFC8A05C476D7D93");

                entity.Property(e => e.Amount).HasColumnType("money");
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.IsCompanyExpenses).HasColumnName("isCompanyExpenses");
                entity.Property(e => e.PaidBy)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.SpentDate).HasColumnType("datetime");
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Order).WithMany(p => p.Expenses)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK__Expenses__PaidBy__6754599E");
            });

            modelBuilder.Entity<MoneyTransfer>(entity =>
            {
                entity.HasKey(e => e.MoneyTransfersId).HasName("PK__MoneyTra__606AAEC67688FCF7");

                entity.Property(e => e.TransferAmount).HasColumnType("money");
                entity.Property(e => e.TransferBy).HasMaxLength(50);
                entity.Property(e => e.TransferDate).HasColumnType("datetime");
                entity.Property(e => e.TransferFrom)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.TransferTo)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF8C8255AE");

                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.DeletedBy).HasMaxLength(50);
                entity.Property(e => e.Note).HasMaxLength(100);
                entity.Property(e => e.OrderDate).HasColumnType("datetime");
                entity.Property(e => e.OrderName).HasMaxLength(100);
                entity.Property(e => e.PaidAmount).HasColumnType("money");
                entity.Property(e => e.TotalAmount).HasColumnType("money");
                entity.Property(e => e.TotalBalance).HasColumnType("money");
                entity.Property(e => e.TotalDiscount).HasColumnType("money");
                entity.Property(e => e.TotalExpenses).HasColumnType("money");
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__57ED0681D6FB2133");

                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("money");

                entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__OrderItem__Order__6EF57B66");
            });

            modelBuilder.Entity<OrderType>(entity =>
            {
                entity.HasKey(e => e.OrderTypeId).HasName("PK__OrderTyp__23AC266C76E0B57A");

                entity.Property(e => e.OrderTypeName).HasMaxLength(50);
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A3857512FC8");

                entity.Property(e => e.Amount).HasColumnType("money");
                entity.Property(e => e.CreatedBy)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.DeletedBy).HasMaxLength(50);
                entity.Property(e => e.PaidBy).HasMaxLength(30);
                entity.Property(e => e.PaidTo)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.PaymentDate).HasColumnType("datetime");
                entity.Property(e => e.UpdatedBy).HasMaxLength(50);
                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Payments__PayTo__6A30C649");
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.HasKey(e => e.StatusId).HasName("PK__Statuses__C8EE2063D4E57A88");

                entity.Property(e => e.StatusId).ValueGeneratedNever();
                entity.Property(e => e.StatusCategory).HasMaxLength(50);
                entity.Property(e => e.StatusName).HasMaxLength(30);
            });

            modelBuilder.Entity<OrderImage>(entity =>
            {
                entity.HasKey(e => e.ImageId).HasName("PK__OrderIma__7516F70CC6FB7885");

                entity.Property(e => e.ImageUrl).HasMaxLength(400);
                entity.Property(e => e.PublicId).HasMaxLength(200);

                entity.HasOne(d => d.Order).WithMany(p => p.OrderImages)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrderImages_Orders");
            });

            OnModelCreatingPartial(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
