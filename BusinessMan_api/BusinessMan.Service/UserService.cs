using BusinessMan.Core.Extentions;
using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    // TODO: Implement the UserService class 
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;

        public UserService(IRepositoryManager repositoryManager, IEmailService emailService, IUserRepository userRepository)
        {
            _repositoryManager = repositoryManager;
            _emailService = emailService;
            _userRepository = userRepository;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _repositoryManager.User.GetByIdAsync(id);
        }

        public async Task<IEnumerable<User>> GetListAsync()
        {
            return await _repositoryManager.User.GetAllAsync();
        }

        public async Task<User> AddAsync(User user)
        {
            // בדיקה שהמייל ברשימה
            var isExists = await _emailService.EmailExistsAsync(user.Email);
            if (!isExists)
            {
                throw new NotFoundException("Email does not exist. You do not have permission to perform this action.");
            }

            // בדיקה שהיוזר אינו קיים
            var userExists = await _userRepository.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (userExists != default)
            {
                throw new Exceptions("The user already exists. User cannot be added.");
            }

            await _repositoryManager.User.AddAsync(user);
            await _repositoryManager.SaveAsync(); 
            return user;
        }

        public async Task DeleteAsync(User item)
        {
            await _repositoryManager.User.DeleteAsync(item);
            await _repositoryManager.SaveAsync(); 
        }

        public async Task<User?> UpdateAsync(int id, User item)
        {
            item.UpdatedAt = DateTime.UtcNow;
            var updatedUser = await _repositoryManager.User.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync();
            return updatedUser;
        }

        public async Task<bool> RemoveUserByEmailAsync(string emailAddress)
        {
            var userToRemove = await _userRepository.FirstOrDefaultAsync(u => u.Email == emailAddress);
            if (userToRemove == null)
            {
                return false; // המשתמש לא נמצא
            }

            await _repositoryManager.User.DeleteAsync(userToRemove);
            await _repositoryManager.SaveAsync();
            return true; // המחיקה בוצעה בהצלחה
        }

        //////
        //public async Task<User?> AuthenticateAsync(string username, string password)
        //{
        //    var user = await _userRepository.GetByUsernameAsync(username);
        //    if (user != null && user.PasswordHash == Hash(password)) 
        //        return user;

        //    return null;
        //}

        public async Task<User?> GetUserWithBusinessAsync(int userId)
        {
            return await _userRepository.GetWithBusinessAsync(userId);
        }

        private string Hash(string password)
        {
            // הצפנת סיסמה פשוטה – החליפי ב־BCrypt/Hash
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(password));
        }

        public Task<User?> AuthenticateAsync(string username, string password)
        {
            throw new NotImplementedException();
        }
    }
}