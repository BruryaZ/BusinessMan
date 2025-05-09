using BusinessMan.Core.Services;
using BusinessMan.Service;
using System.Security.Claims;

namespace BusinessMan.API.Middlwares
{
    public class UserContextMiddleware
    {
        private readonly RequestDelegate _next;

        public UserContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService)
        {
            var userIdClaim = context.User.FindFirst("user_id");
            var businessIdClaim = context.User.FindFirst("business_id");

            Console.WriteLine($"UserIdClaim: {userIdClaim?.Value}");
            Console.WriteLine($"BusinessIdClaim: {businessIdClaim?.Value}");
            Console.WriteLine($"IsAuthenticated: {context.User.Identity?.IsAuthenticated}");

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                var user = await userService.GetUserWithBusinessAsync(userId);
                Console.WriteLine($"Fetched User: {System.Text.Json.JsonSerializer.Serialize(user)}");

                context.Items["CurrentUser"] = user;
            }

            await _next(context);
        }
    }
}