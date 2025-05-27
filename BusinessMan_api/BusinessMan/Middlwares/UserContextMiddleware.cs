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
            // קודם מנסה דרך Authorization Header
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            // אם לא נמצא, מנסה דרך Cookie
            if (string.IsNullOrEmpty(token))
            {
                token = context.Request.Cookies["jwt"];
            }

            Console.WriteLine($"Token: {token}");

            if (!string.IsNullOrEmpty(token))
            {
                // אם המערכת של JwtBearer פועלת, Claims כבר קיימים כאן
                var userIdClaim = context.User.FindFirst("user_id");
                var businessIdClaim = context.User.FindFirst("business_id");

                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                {
                    var user = await userService.GetUserWithBusinessAsync(userId);
                    Console.WriteLine("Fetched User: " +
                        System.Text.Json.JsonSerializer.Serialize(user, new System.Text.Json.JsonSerializerOptions
                        {
                            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                            WriteIndented = true
                        }));

                    context.Items["CurrentUser"] = user;
                }
                else
                {
                    Console.WriteLine("Token found but claims are missing or invalid.");
                }
            }
            else
            {
                Console.WriteLine("No token found in header or cookie.");
            }

            await _next(context);
        }
    }
}