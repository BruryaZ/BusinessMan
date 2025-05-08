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
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
            var businessIdClaim = context.User.FindFirst("business_id");

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                var user = await userService.GetUserWithBusinessAsync(userId);
                context.Items["CurrentUser"] = user;
            }

            await _next(context);
        }
    }
}