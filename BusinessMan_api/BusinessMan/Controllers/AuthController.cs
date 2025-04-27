using AutoMapper;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessMan.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous] // מאפשר גישה ללא הזדהות לכל הפעולות ב-controller
    public class AuthController : Controller
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public AuthController(DataContext context, IConfiguration configuration, IUserRepository userRepository, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("user-login")]// כניסת משתמש רגיל
        public IActionResult Login([FromBody] UserLoginModel user)
        {
            // בדיקה אם המשתמש קיים במסד הנתונים
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            string token;

            if (existingUser != null)
                token = GenerateJwtToken(existingUser.FirstName, false);

            else
                return NotFound(new { Message = "המשתמש לא קיים" });

            if (user.Password != existingUser.Password)
            {
                return Unauthorized(new { Message = "סיסמה שגויה" });
            }

            return Ok(new { Token = token });
        }

        [HttpPost("user-register")]// רישום משתמש רגיל
        public async Task<IActionResult> RegisterAsync([FromBody] UserPostModel user)
        {
            // בדוק אם המשתמש כבר קיים
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.IdNumber == user.IdNumber);

            if (existingUser != null)
            {
                return BadRequest(new { Message = "משתמש כבר קיים" });
            }

            // הוסף את המשתמש החדש למסד הנתונים
            var userToAdd = _mapper.Map<User>(user);  
            await _context.Users.AddAsync(userToAdd);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "הרשמה בוצעה בהצלחה" });
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
            var token = GenerateJwtToken(email.EmailAddress, true);
            return Ok(new { Token = token, Message = "Email added to the list successfully." });
        }

        [HttpPost("admin-register")]// רישום מנהל
        public async Task<IActionResult> RegisterAdminAsync([FromBody] UserPostModel user)
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
            _context.Users.Add(userToAdd);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "הרשמה בוצעה בהצלחה" });
        }

        [HttpPost]
        [Route("api/admin-login")]// כניסת מנהל
        public async Task<ActionResult> AdminLogin([FromBody] UserLoginModel user)
        {
            // בדוק אם האימייל קיים ברשימה
            var emailExists = await _context.EmailList.FirstOrDefaultAsync(e => e.EmailAddress == user.Email);
            if (emailExists == null)
            {
                return BadRequest("אתה לא מורשה להיכנס כמנהל אנא פנה למנהל המערכת להרשמה");
            }

            // בדוק אם המשתמש קיים
            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == emailExists.EmailAddress);

            if(existingUser == null)
            {
                return BadRequest("User not found.");
            }

            if (existingUser.Password != user.Password)
            {
                return Unauthorized("הסיסמא שגויה");
            }

            // בדיקה אם המשתמש הוא מנהל
            if (existingUser.Role != 1) // 1 הוא תפקיד מנהל
            {
                return Forbid("You are not authorized to access this resource.");
            }

            // יצירת טוקן
            var token = GenerateJwtToken(existingUser.FirstName, true);
            return Ok(new { Token = token, User = existingUser });
        }

        [HttpDelete("api/remove-admin")]// מחיקת מנהל על ידי המתכנת
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
            var token = GenerateJwtToken(emailAddress, true);
            return Ok(new { Token = token, Message = "Email removed from the list successfully." });
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

        private string GenerateJwtToken(string username, bool isAdmin)
        {
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            // הוסף את ה-Claim של תפקיד אם המשתמש הוא Admin
            if (isAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("WeTrustInHashemHeIsHelpEveryone12345678910"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "Management business",
                audience: "Business owner",
                claims: claims,
                expires: DateTime.Now.AddMinutes(12),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}