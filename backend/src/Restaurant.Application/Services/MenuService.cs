using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Restaurant.Application.DTOs;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Interfaces;

namespace Restaurant.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepository;

        public MenuService(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        public async Task<IEnumerable<MenuDto>> GetAllAsync()
        {
            var menuItems = await _menuRepository.GetAllAsync();
            return menuItems.Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Price = m.Price,
                Category = m.Category,
                ImageUrl = m.ImageUrl
            });
        }

        public async Task<MenuDto?> GetByIdAsync(int id)
        {
            var menuItem = await _menuRepository.GetByIdAsync(id);
            if (menuItem == null) return null;

            return new MenuDto
            {
                Id = menuItem.Id,
                Name = menuItem.Name,
                Description = menuItem.Description,
                Price = menuItem.Price,
                Category = menuItem.Category,
                ImageUrl = menuItem.ImageUrl
            };
        }

        public async Task<MenuDto> CreateAsync(MenuDto menuDto)
        {
            var menuItem = new MenuItem
            {
                Name = menuDto.Name,
                Description = menuDto.Description,
                Price = menuDto.Price,
                Category = menuDto.Category,
                ImageUrl = menuDto.ImageUrl,
                IsAvailable = true
            };

            var createdItem = await _menuRepository.AddAsync(menuItem);

            menuDto.Id = createdItem.Id;
            return menuDto;
        }

        public async Task UpdateAsync(int id, MenuDto menuDto)
        {
            var existingItem = await _menuRepository.GetByIdAsync(id);
            if (existingItem == null) return;

            existingItem.Name = menuDto.Name;
            existingItem.Description = menuDto.Description;
            existingItem.Price = menuDto.Price;
            existingItem.Category = menuDto.Category;
            existingItem.ImageUrl = menuDto.ImageUrl;

            await _menuRepository.UpdateAsync(existingItem);
        }

        public async Task DeleteAsync(int id)
        {
            await _menuRepository.DeleteAsync(id);
        }
    }
}
