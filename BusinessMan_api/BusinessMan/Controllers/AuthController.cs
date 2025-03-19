﻿using BusinessMan.Core.Models;
using BusinessMan.Data;
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
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            // בדיקה אם המשתמש קיים במסד הנתונים
            var existingUser = _context.Users.FirstOrDefault(u => u.FirstName == user.FirstName && u.Password == user.Password);

            if (existingUser != null)
            {
                var token = GenerateJwtToken(existingUser.FirstName);
                return Ok(new { Token = token });
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] User user)
        {
            // בדיקה שהאימייל הוכנס לרשימה כלומר רשמתי אותו לאפליקצייה
            var emailExists = await _context.EmailList.AnyAsync(e => e.EmailAddress == user.Email);
            if (!emailExists)
            {
                return BadRequest("Email not authorized to register.");
            }

            // בדוק אם המשתמש כבר קיים
            var existingUser = _context.Users.FirstOrDefault(u => u.FirstName == user.FirstName);

            if (existingUser != null)
            {
                return BadRequest(new { Message = "משתמש כבר קיים" });
            }

            // הוסף את המשתמש החדש למסד הנתונים
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { Message = "הרשמה בוצעה בהצלחה" });
        }

        [HttpPost]
        [Route("api/add-email")]
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

            return Ok("Email added to the list successfully.");
        }

        [HttpDelete("api/remove-email")]
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

            return Ok(new { message = "Email removed from the list successfully." });
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

        private string GenerateJwtToken(string username)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKey"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "YourIssuer",
                audience: "YourAudience",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}