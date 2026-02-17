using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.DTOs;
using Restaurant.Application.Services;
using Restaurant.Domain.Enums;

namespace Restaurant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            return Ok(await _orderService.GetAllOrdersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                return Ok(order);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create([FromBody] CreateOrderDto dto)
        {
            var created = await _orderService.CreateOrderAsync(dto.TableNumber, dto.Items, dto.Notes ?? string.Empty);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            if (Enum.TryParse<OrderStatus>(status, true, out var result))
            {
                try
                {
                    await _orderService.UpdateOrderStatusAsync(id, result);
                    return NoContent();
                }
                catch (KeyNotFoundException)
                {
                    return NotFound();
                }
            }
            return BadRequest("Invalid status code");
        }

        [HttpPost("{id}/items")]
        public async Task<ActionResult<OrderDto>> AddItems(int id, [FromBody] List<OrderItemDto> items)
        {
            try
            {
                var updatedOrder = await _orderService.AddItemsToOrderAsync(id, items);
                return Ok(updatedOrder);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("table/{tableNumber}/active")]
        public async Task<ActionResult<OrderDto>> GetActiveOrder(string tableNumber)
        {
            var order = await _orderService.GetActiveOrderByTableAsync(tableNumber);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("revenue")]
        public async Task<ActionResult<decimal>> GetDailyRevenue([FromQuery] DateTime? date)
        {
            var targetDate = date ?? DateTime.UtcNow;
            return Ok(await _orderService.CalculateDailyRevenueAsync(targetDate));
        }
    }
}
