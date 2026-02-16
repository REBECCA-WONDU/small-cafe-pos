using System;
using System.Collections.Generic;

namespace Restaurant.Application.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string? TableNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending";
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public string? Notes { get; set; }
    }
}
