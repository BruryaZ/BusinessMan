using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    public class AuthService(IConfiguration configuration) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        // Generate JWT token for user login
   
        public UserLoginResponse GenerateJwtToken(int userId, int? businessId, string userName, int role)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("business_id", businessId.ToString()),
            new Claim(ClaimTypes.Name, userName),
            new Claim(ClaimTypes.Role, role.ToString()),
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new UserLoginResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                UserName = userName,
                BusinessId = businessId
            };
        }
    }
}