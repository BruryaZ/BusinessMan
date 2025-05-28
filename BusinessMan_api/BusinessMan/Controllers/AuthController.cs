using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data;
using BusinessMan.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[AllowAnonymous] // מאפשר גישה ללא הזדהות לכל הפעולות ב-controller // TODO להסיר
    public class AuthController : Controller
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IRepositoryManager _repositoryManager;

        public AuthController(DataContext context, IConfiguration configuration, IUserRepository userRepository, IMapper mapper, IAuthService authService, IUserService userService, IRepositoryManager repositoryManager)
        {
            _context = context;
            _configuration = configuration;
            _userRepository = userRepository;
            _mapper = mapper;
            _authService = authService;
            _userService = userService;
            _repositoryManager = repositoryManager;
        }

        [HttpPost("user-login")]// כניסת משתמש רגיל
        public async Task<IActionResult> Login([FromBody] UserLoginModel user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null)
                return NotFound(new { Message = "המשתמש לא קיים" });

            if (user.Password != existingUser.Password)
                return Unauthorized(new { Message = "סיסמה שגויה" });

            var token = _authService.GenerateJwtToken(existingUser.Id, existingUser.BusinessId, existingUser.FirstName, existingUser.Role, existingUser.Email);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(1)
            });

            return Ok(new
            {
                Message = "ההתחברות הצליחה",
                User = new
                {
                    existingUser.Id,
                    existingUser.BusinessId,
                    existingUser.FirstName,
                    existingUser.Role,
                    existingUser.Email
                }
            });
        }

        [HttpPost("user-register")]// רישום משתמש רגיל
        public async Task<ActionResult<UserDto>> RegisterAsync([FromBody] UserPostModel user)
        {
            // בדוק אם המשתמש כבר קיים
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.IdNumber == user.IdNumber);

            if (existingUser != null)
            {
                return BadRequest(new { Message = "משתמש כבר קיים" });
            }

            // הוסף את המשתמש החדש למסד הנתונים
            var userToAdd = _mapper.Map<User>(user);
            userToAdd.BusinessId =  int.Parse(User.FindFirst("business_id").Value);
            userToAdd.Business = await _repositoryManager.Business.GetByIdAsync(userToAdd.BusinessId ?? 0);
            await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<UserDto>(userToAdd));
        }

        [HttpDelete("delete-user")]// מחיקת משתמש רגיל
        public async Task<IActionResult> DeleteUserAsync([FromQuery] int id)
        {
            // חיפוש המשתמש במסד הנתונים
            var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (userToDelete == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // הסרת המשתמש מהמסד נתונים
            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User deleted successfully." });
        }

        [HttpPost]
        [Route("api/admin-register-by-dev")]// רישום מנהל על ידי המתכנת
        public async Task<ActionResult> AddEmailToList([FromBody] Email email)
        {
            // בדוק אם האימייל חוקי
            if (!IsValidEmail(email.EmailAddress))
            {
                return BadRequest("Invalid email format.");
            }

            // בדוק אם האימייל כבר קיים ברשימה
            var emailExists = await _context.EmailList.AnyAsync(e => e.EmailAddress == email.EmailAddress);
            if (emailExists)
            {
                return Conflict("Email already exists in the list.");
            }

            // הוסף את האימייל לרשימה
            await _context.EmailList.AddAsync(new Email() { EmailAddress = email.EmailAddress });
            await _context.SaveChangesAsync();

            // יצירת טוקן
            //var token = GenerateJwtToken(email.EmailAddress, true);
            // החזרת טוקן
            return Ok(new { Message = "Email added to the list successfully." });
        }

        [HttpPost("admin-register")]// רישום מנהל
        public async Task<ActionResult<UserDto>> RegisterAdminAsync([FromBody] UserPostModel user)
        {
            // בדיקה שהאימייל הוכנס לרשימה כלומר רשמתי אותו לאפליקצייה
            var emailExists = await _context.EmailList.AnyAsync(e => e.EmailAddress == user.Email);
            if (!emailExists)
            {
                return BadRequest("Email not authorized to register.");
            }

            // בדוק אם המשתמש כבר קיים
            var existingUser = _context.Users.FirstOrDefault(u => u.IdNumber == user.IdNumber);

            if (existingUser != null)
            {
                return BadRequest(new { Message = "משתמש כבר קיים" });
            }

            // הוסף את המשתמש החדש למסד הנתונים
            var userToAdd = _mapper.Map<User>(user);
            var createUserEntry = await _context.Users.AddAsync(userToAdd);
            var createUser = createUserEntry.Entity;
            Console.WriteLine(userToAdd.BusinessId);
            await _context.SaveChangesAsync();
            var userWithId = await _userRepository.GetByIdAsync(createUser.Id);

            return Ok(_mapper.Map<UserDto>(createUser));
        }

        [HttpPost("admin-login")]// כניסת מנהל
        public async Task<ActionResult> AdminLogin([FromBody] UserLoginModel user)
        {
            var emailExists = await _context.EmailList.FirstOrDefaultAsync(e => e.EmailAddress == user.Email);
            if (emailExists == null)
                return BadRequest("אתה לא מורשה להיכנס כמנהל");

            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == emailExists.EmailAddress);
            if (existingUser == null)
                return BadRequest("User not found.");

            if (existingUser.Password != user.Password)
                return Unauthorized("הסיסמא שגויה");

            if (existingUser.Role != 1)
                return Forbid("אין הרשאה");

            var token = _authService.GenerateJwtToken(existingUser.Id, existingUser.BusinessId, existingUser.FirstName, existingUser.Role, existingUser.Email);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                Message = "התחברות כמנהל הצליחה",
                User = new
                {
                    existingUser.Id,
                    existingUser.BusinessId,
                    existingUser.FirstName,
                    existingUser.Role,
                    existingUser.Email
                }
            });
        }


        [HttpDelete("api/remove-admin-by-dev")]// מחיקת מנהל על ידי המתכנת
        public async Task<ActionResult> RemoveEmailFromList([FromQuery] string emailAddress)
        {
            // חפש את האימייל ברשימה
            var emailToRemove = await _context.EmailList.FirstOrDefaultAsync(e => e.EmailAddress == emailAddress);

            if (emailToRemove == null)
            {
                return NotFound(new { error = "Email not found in the list." });
            }

            // הסר את האימייל מהרשימה
            _context.EmailList.Remove(emailToRemove);
            await _context.SaveChangesAsync();

            // הסרת המשתמש מרשימת שמשתמשים
            var res = await _userRepository.RemoveByEmailAsync(emailAddress);

            // יצירת טוקן
            return Ok(new { Message = "Email removed from the list successfully." });
        }

        // פעולה להחזרת פרופיל משתמש
        [Authorize]  // דרישת התחברות עם JWT Token
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // חילוץ מזהה המשתמש מהטוקן
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // קבלת פרטי המשתמש יחד עם פרטי העסק
            var user = await _userService.GetUserWithBusinessAsync(userId);

            // אם לא נמצא משתמש או שהמשתמש לא מחובר
            if (user == null)
            {
                return Unauthorized();  // או NotFound()
            }

            // החזרת נתוני המשתמש והעסק
            return Ok(new
            {
                user.FirstName,
                BusinessName = user.Business?.Name
            });
        }

        [Authorize]
        [HttpGet]
        public IActionResult Test()
        {
            var userId = User.FindFirst("user_id")?.Value;
            var businessId = User.FindFirst("business_id")?.Value;

            return Ok(new { userId, businessId, isAuth = User.Identity?.IsAuthenticated });
        }


        // פונקציה לבדוק אם האימייל חוקי
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}