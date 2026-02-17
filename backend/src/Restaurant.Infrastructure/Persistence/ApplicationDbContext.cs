using Microsoft.EntityFrameworkCore;
using Restaurant.Domain.Entities;

namespace Restaurant.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(o => o.Price)
                .HasColumnType("decimal(18,2)");

            // Seeding Data
            modelBuilder.Entity<MenuItem>().HasData(
                // Breakfast
                new MenuItem { Id = 1, Name = "Classic Eggs Benedict", Description = "Poached organic eggs on toasted english muffin with canadian bacon and hollandaise.", Price = 14.50m, Category = "Breakfast", ImageUrl = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 2, Name = "Smashed Avocado Toast", Description = "Sourdough toast topped with smashed avocado, cherry tomatoes, radish, and feta cheese.", Price = 12.00m, Category = "Breakfast", ImageUrl = "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 3, Name = "Blueberry Pancakes", Description = "Fluffy buttermilk pancakes served with fresh blueberries and maple syrup.", Price = 11.50m, Category = "Breakfast", ImageUrl = "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=800&q=80" },

                // Fast Food / Lunch
                new MenuItem { Id = 4, Name = "Truffle Wagyu Burger", Description = "Wagyu beef patty, truffle aioli, gruyere cheese, caramelized onions on brioche bun.", Price = 18.95m, Category = "Fast Food", ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 5, Name = "Margherita Pizza", Description = "San Marzano tomato sauce, buffalo mozzarella, fresh basil, extra virgin olive oil.", Price = 15.00m, Category = "Fast Food", ImageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 6, Name = "Crispy Chicken Sandwich", Description = "Buttermilk fried chicken breast, coleslaw, pickles, spicy mayo.", Price = 13.50m, Category = "Fast Food", ImageUrl = "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 7, Name = "Club Sandwich", Description = "Triple-decker toasted bread with roasted turkey, bacon, lettuce, tomato, and mayo.", Price = 14.00m, Category = "Fast Food", ImageUrl = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80" },

                // Drinks - Hot
                new MenuItem { Id = 8, Name = "Cappuccino", Description = "Rich espresso with steamed milk and deep layer of foam.", Price = 4.50m, Category = "Coffee", ImageUrl = "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 9, Name = "Latte Macchiato", Description = "Espresso 'stained' with a dash of frothy milk.", Price = 4.75m, Category = "Coffee", ImageUrl = "https://images.unsplash.com/photo-1570968992193-d6ea0696f9d3?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 10, Name = "Matcha Green Tea Latte", Description = "Premium matcha whisked with steamed oat milk.", Price = 5.50m, Category = "Tea", ImageUrl = "https://images.unsplash.com/photo-1515823664-b691a8e0bebe?auto=format&fit=crop&w=800&q=80" },

                // Drinks - Cold
                new MenuItem { Id = 11, Name = "Fresh Orange Juice", Description = "Freshly squeezed valencia oranges.", Price = 6.00m, Category = "Juice", ImageUrl = "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 12, Name = "Iced Caramel Macchiato", Description = "Espresso poured over ice with vanilla syrup and caramel drizzle.", Price = 5.25m, Category = "Coffee", ImageUrl = "https://images.unsplash.com/photo-1517701604599-bb29b5c73553?auto=format&fit=crop&w=800&q=80" },
                new MenuItem { Id = 13, Name = "Mineral Water (Still)", Description = "750ml bottle of premium still mineral water.", Price = 3.50m, Category = "Water", ImageUrl = "https://images.unsplash.com/photo-1551630134-2e2d93b9e43a?auto=format&fit=crop&w=800&q=80" }
            );
        }
    }
}
