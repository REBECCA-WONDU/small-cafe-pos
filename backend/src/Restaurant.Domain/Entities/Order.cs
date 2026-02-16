using Restaurant.Domain.Enums;

namespace Restaurant.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string? TableNumber { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public string? Notes { get; set; }
    }
}
