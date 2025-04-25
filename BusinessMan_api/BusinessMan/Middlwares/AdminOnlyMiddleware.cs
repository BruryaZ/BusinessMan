using System.Security.Claims;

namespace BusinessMan.API.Middlwares
{
    public class AdminOnlyMiddleware(RequestDelegate request, ILogger<AdminOnlyMiddleware> logger)
    {
        private readonly RequestDelegate _next = request;
        private readonly ILogger<AdminOnlyMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            var guid = Guid.NewGuid().ToString();
            _logger.LogInformation($"Request Starts {guid}");
            _logger.LogInformation($"Context contains {context}");

            // שליפת תפקיד המשתמש מתוך ה-Claims ב-JWT Token
            var userRole = context.User?.FindFirst(ClaimTypes.Role)?.Value;

            // אם אין תפקיד או אם התפקיד לא "Admin", נחסום את הגישה
            if (string.IsNullOrEmpty(userRole) || userRole != "Admin")
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden: You do not have access to view business data.");
                return;
            }

            // אם התפקיד הוא Admin, נמשיך לבקש את ה-Next Middleware או ה-Controller
            context.Items.Add("ReqId", guid);
            await _next(context);
            _logger.LogInformation($"Request Ends {guid}");
        }
    }
}
