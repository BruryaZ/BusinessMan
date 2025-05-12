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
      
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            Console.WriteLine($"Token: {token}");

            if (!string.IsNullOrEmpty(token))
            {
                var userIdClaim = context.User.FindFirst("user_id");
                var businessIdClaim = context.User.FindFirst("business_id");

                //Console.WriteLine($"UserIdClaim: {userIdClaim?.Value}");
                //Console.WriteLine($"BusinessIdClaim: {businessIdClaim?.Value}");
                //Console.WriteLine($"IsAuthenticated: {context.User.Identity?.IsAuthenticated}");

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
            }
            else
            {
                Console.WriteLine("No token found.");
            }

            await _next(context);
        }
    }
}