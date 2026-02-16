using Microsoft.Extensions.DependencyInjection;
using Restaurant.Application.Services;

namespace Restaurant.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IOrderService, OrderService>();
            
            return services;
        }
    }
}
