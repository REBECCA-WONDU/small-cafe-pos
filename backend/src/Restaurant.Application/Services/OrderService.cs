using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Restaurant.Application.DTOs;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Enums;
using Restaurant.Domain.Interfaces;

namespace Restaurant.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMenuRepository _menuRepository;

        public OrderService(IOrderRepository orderRepository, IMenuRepository menuRepository)
        {
            _orderRepository = orderRepository;
            _menuRepository = menuRepository;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToDto);
        }

        public async Task<OrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) throw new KeyNotFoundException($"Order with ID {id} not found.");
            return MapToDto(order);
        }

        public async Task<OrderDto> CreateOrderAsync(string tableNumber, List<OrderItemDto> items, string notes)
        {
            var order = new Order
            {
                TableNumber = tableNumber,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                Notes = notes
            };

            foreach (var itemDto in items)
            {
                var menuItem = await _menuRepository.GetByIdAsync(itemDto.MenuItemId);
                if (menuItem == null) continue; // Or throw an exception

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    MenuItemName = menuItem.Name,
                    Price = menuItem.Price, // Snapshot price
                    Quantity = itemDto.Quantity,
                    SpecialInstructions = itemDto.SpecialInstructions
                };
                order.OrderItems.Add(orderItem);
            }

            order.TotalPrice = order.OrderItems.Sum(i => i.Price * i.Quantity);

            await _orderRepository.AddAsync(order);

            return MapToDto(order);
        }

        public async Task<OrderDto> AddItemsToOrderAsync(int orderId, List<OrderItemDto> items)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new KeyNotFoundException($"Order with ID {orderId} not found.");

            if (order.Status != OrderStatus.Pending)
            {
                throw new InvalidOperationException("Can only add items to pending orders.");
            }

            foreach (var itemDto in items)
            {
                var menuItem = await _menuRepository.GetByIdAsync(itemDto.MenuItemId);
                if (menuItem == null) continue;

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    MenuItemName = menuItem.Name,
                    Price = menuItem.Price,
                    Quantity = itemDto.Quantity,
                    SpecialInstructions = itemDto.SpecialInstructions
                };
                order.OrderItems.Add(orderItem);
            }

            order.TotalPrice = order.OrderItems.Sum(i => i.Price * i.Quantity);
            await _orderRepository.UpdateAsync(order);
            
            return MapToDto(order);
        }

        public async Task UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new KeyNotFoundException($"Order with ID {orderId} not found.");

            order.Status = status;
            await _orderRepository.UpdateAsync(order);
        }

        public async Task<OrderDto> GetActiveOrderByTableAsync(string tableNumber)
        {
            var allOrders = await _orderRepository.GetAllAsync();
            var activeOrder = allOrders.FirstOrDefault(o => o.TableNumber == tableNumber && o.Status == OrderStatus.Pending);
            
            return activeOrder != null ? MapToDto(activeOrder) : null;
        }

        public async Task<decimal> CalculateDailyRevenueAsync(DateTime date)
        {
            // Ideally repository handles filtering, but for clean arch we can just get all and filter in memory if small, or add specific method to repo.
            // Let's assume we fetch all for now or I add a specific method to repo later.
            // Actually, I'll filter in memory here assuming volume isn't huge for this "simple" app, or better:
            // The repository interface has GetByStatusAsync, maybe I should add GetByDateAsync?
            // For now, I'll fetch all and filter.
            var allOrders = await _orderRepository.GetAllAsync();
            
            return allOrders
                .Where(o => o.OrderDate.Date == date.Date && (o.Status == OrderStatus.Paid || o.Status == OrderStatus.Completed))
                .Sum(o => o.TotalPrice);
        }

        private static OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                TableNumber = order.TableNumber,
                OrderDate = order.OrderDate,
                TotalPrice = order.TotalPrice,
                Status = order.Status.ToString(),
                Notes = order.Notes,
                OrderItems = order.OrderItems.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    MenuItemId = i.MenuItemId,
                    MenuItemName = i.MenuItemName,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    SpecialInstructions = i.SpecialInstructions
                }).ToList()
            };
        }
    }
}
