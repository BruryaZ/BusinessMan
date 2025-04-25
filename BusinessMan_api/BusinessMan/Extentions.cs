using BusinessMan.API.Middlwares;

namespace BusinessMan.API
{
    public static class Extentions
    {

        /// <summary>
        /// Middleware שמוודא שהמשתמש הוא Admin לפני שהוא יכול לגשת לנתוני העסקים
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        /// 
        public static IApplicationBuilder UseAdminOnly(this IApplicationBuilder app)
        {
            app.UseMiddleware<AdminOnlyMiddleware>();
            return app;
        }
    }
}
