//using Microsoft.AspNetCore.Http;
//using System.Security.Claims;

//namespace BusinessMan.API.Middleware
//{
//    public class AdminAuthorizationMiddleware
//    {
//        private readonly RequestDelegate _next;
//        private readonly ILogger<AdminAuthorizationMiddleware> _logger;
//        private readonly List<KeyValuePair<string, List<string>>> _protectedRoutes;

//        public AdminAuthorizationMiddleware(RequestDelegate next, ILogger<AdminAuthorizationMiddleware> logger)
//        {
//            _next = next;
//            _logger = logger;
//            _protectedRoutes = new List<KeyValuePair<string, List<string>>>
//        {
//            new KeyValuePair<string, List<string>>("/admin", new List<string> { "GET", "POST" })
//            // הוסף כאן את שאר המסלולים המוגנים
//        };
//        }

//        public async Task InvokeAsync(HttpContext context)
//        {
//            var guid = Guid.NewGuid().ToString();
//            context.Items["ReqId"] = guid;
//            _logger.LogInformation("Request Start: {RequestId}", guid);

//            var roleClaim = context.User?.FindFirst(ClaimTypes.Role)?.Value;

//            foreach (var route in _protectedRoutes)
//            {
//                if (context.Request.Path.StartsWithSegments(route.Key, StringComparison.OrdinalIgnoreCase) &&
//                    route.Value.Contains(context.Request.Method, StringComparer.OrdinalIgnoreCase))
//                {
//                    if (string.IsNullOrEmpty(roleClaim) || !roleClaim.Equals("Admin", StringComparison.OrdinalIgnoreCase))
//                    {
//                        _logger.LogWarning("Access denied. RequestId: {RequestId}, Path: {Path}, Method: {Method}", guid, context.Request.Path, context.Request.Method);

//                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
//                        context.Response.ContentType = "application/json";

//                        var errorResponse = new
//                        {
//                            error = "Forbidden: Only admins can access this resource."
//                        };

//                        await context.Response.WriteAsJsonAsync(errorResponse);
//                        return;
//                    }
//                }
//            }

//            await _next(context);
//            _logger.LogInformation("Request End: {RequestId}", guid);
//        }
//    }
//}
