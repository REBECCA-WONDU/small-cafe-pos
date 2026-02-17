using System.Collections.Generic;
using System.Threading.Tasks;
using Restaurant.Application.DTOs;
using Restaurant.Domain.Enums;

namespace Restaurant.Application.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(string tableNumber, List<OrderItemDto> items, string notes);
        Task<OrderDto> AddItemsToOrderAsync(int orderId, List<OrderItemDto> items);
        Task UpdateOrderStatusAsync(int orderId, OrderStatus status);
        Task<OrderDto> GetActiveOrderByTableAsync(string tableNumber);
        Task<decimal> CalculateDailyRevenueAsync(DateTime date);
    }
}
