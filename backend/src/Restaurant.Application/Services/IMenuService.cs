using System.Collections.Generic;
using System.Threading.Tasks;
using Restaurant.Application.DTOs;

namespace Restaurant.Application.Services
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuDto>> GetAllAsync();
        Task<MenuDto?> GetByIdAsync(int id);
        Task<MenuDto> CreateAsync(MenuDto menuDto);
        Task UpdateAsync(int id, MenuDto menuDto);
        Task DeleteAsync(int id);
    }
}
