using System.Collections.Generic;

namespace Restaurant.Application.DTOs
{
    public class CreateOrderDto
    {
        public string TableNumber { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new();
        public string? Notes { get; set; }
    }
}
