using AutoMapper;
using BusinessMan.Core.BasicModels;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BusinessMan.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IRepositoryManager _repositoryManager;

        public AuthController(DataContext context, IConfiguration configuration, IUserRepository userRepository,
                              IMapper mapper, IAuthService authService, IUserService userService, IRepositoryManager repositoryManager)
        {
            _context = context;
            _configuration = configuration;
            _userRepository = userRepository;
            _mapper = mapper;
            _authService = authService;
            _userService = userService;
            _repositoryManager = repositoryManager;
        }

        [HttpPost("user-login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser == null)
                return NotFound(new { Message = "המשתמש אינו קיים." });

            if (user.Password != existingUser.Password)
                return Unauthorized(new { Message = "הסיסמה שגויה. אנא נסה שוב." });

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
                Message = "ההתחברות בוצעה בהצלחה.",
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

        [HttpPost("user-register")]
        public async Task<ActionResult<UserDto>> RegisterAsync([FromBody] UserPostModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.IdNumber == user.IdNumber);
            if (existingUser != null)
                return BadRequest(new { Message = "משתמש עם תעודת זהות זו כבר קיים במערכת." });

            var businessIdClaim = User.FindFirst("business_id")?.Value;
            if (!int.TryParse(businessIdClaim, out var businessId))
                return Unauthorized(new { Message = "לא נמצאו הרשאות מתאימות לביצוע פעולה זו." });

            var userToAdd = _mapper.Map<User>(user);
            userToAdd.BusinessId = businessId;

            await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<UserDto>(userToAdd));
        }

        [HttpDelete("delete-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUserAsync([FromQuery] int id)
        {
            var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (userToDelete == null)
                return NotFound(new { Message = "המשתמש לא נמצא." });

            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "המשתמש נמחק בהצלחה." });
        }

        [HttpPost("api/admin-register-by-dev")]
        public async Task<ActionResult> AddEmailToList([FromBody] Email email)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!IsValidEmail(email.EmailAddress))
                return BadRequest(new { Message = "פורמט האימייל שגוי. אנא ודא שהכתובת חוקית." });

            var emailExists = await _context.EmailList.AnyAsync(e => e.EmailAddress == email.EmailAddress);
            if (emailExists)
                return Conflict(new { Message = "אימייל זה כבר קיים ברשימה." });

            await _context.EmailList.AddAsync(new Email { EmailAddress = email.EmailAddress });
            await _context.SaveChangesAsync();

            return Ok(new { Message = "האימייל נוסף לרשימת ההרשאות בהצלחה." });
        }

        [HttpPost("admin-register")]
        public async Task<ActionResult<UserDto>> RegisterAdminAsync([FromBody] UserPostModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExists = await _context.EmailList.AnyAsync(e => e.EmailAddress == user.Email);
            if (!emailExists)
                return Unauthorized(new { Message = "האימייל שלך אינו מופיע ברשימת ההרשאות. פנה למנהל המערכת לצורך הרשמה." });

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.IdNumber == user.IdNumber);
            if (existingUser != null)
                return BadRequest(new { Message = "משתמש כבר קיים במערכת." });

            var userToAdd = _mapper.Map<User>(user);
            var createUserEntry = await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();

            var userWithId = await _userRepository.GetByIdAsync(createUserEntry.Entity.Id);
            if (userWithId == null)
                return StatusCode(500, new { Message = "אירעה שגיאה בעת יצירת המשתמש. נסה שוב מאוחר יותר." });

            return Ok(_mapper.Map<UserDto>(userWithId));
        }

        [HttpPost("admin-login")]
        public async Task<ActionResult> AdminLogin([FromBody] UserLoginModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExists = await _context.EmailList.FirstOrDefaultAsync(e => e.EmailAddress == user.Email);
            if (emailExists == null)
                return Unauthorized(new { Message = "אינך רשום לאפליקציה כמנהל." });

            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == emailExists.EmailAddress);
            if (existingUser == null)
                return NotFound(new { Message = "המשתמש לא נמצא." });

            if (existingUser.Password != user.Password)
                return Unauthorized(new { Message = "הסיסמה שגויה. נסה שוב." });

            if (existingUser.Role != 1)
                return StatusCode(403, new { Message = "אין לך הרשאות מתאימות לביצוע פעולה זו." });

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
                Message = "ההתחברות כמנהל בוצעה בהצלחה.",
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

        [HttpDelete("api/remove-admin-by-dev")]
        public async Task<ActionResult> RemoveEmailFromList([FromQuery] string emailAddress)
        {
            var emailToRemove = await _context.EmailList.FirstOrDefaultAsync(e => e.EmailAddress == emailAddress);
            if (emailToRemove == null)
                return NotFound(new { Message = "האימייל לא נמצא ברשימה." });

            _context.EmailList.Remove(emailToRemove);
            await _context.SaveChangesAsync();

            await _userRepository.RemoveByEmailAsync(emailAddress);

            return Ok(new { Message = "האימייל הוסר מהרשימה בהצלחה." });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { Message = "ההרשאות אינן תקפות. אנא התחבר מחדש." });

            var user = await _userService.GetUserWithBusinessAsync(userId);
            if (user == null)
                return Unauthorized(new { Message = "המשתמש לא נמצא או שאינו מחובר." });

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

            return Ok(new
            {
                userId,
                businessId,
                isAuth = User.Identity?.IsAuthenticated
            });
        }

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