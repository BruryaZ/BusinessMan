using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BusinessMan.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<User> _dbSet;

        public UserRepository(DataContext context)
        {
            _context = context;
            _dbSet = context.Set<User>();
        }

        public async Task<User> AddAsync(User entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync(); // שמירה על השינויים
            return entity;
        }

        public async Task DeleteAsync(User entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync(); // שמירה על השינויים
        }

        public async Task<User> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbSet.ToListAsync(); // מחזיר את כל המשתמשים
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id); // מחפש את המשתמש לפי מזהה
        }

        public async Task<User> UpdateAsync(int id, User entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync(); // שמירה על השינויים
            return entity;
        }

        public async Task<bool> RemoveByEmailAsync(string email)
        {
            var userToRemove = await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
            if (userToRemove == null)
            {
                return false; // המשתמש לא נמצא
            }

            _dbSet.Remove(userToRemove);
            await _context.SaveChangesAsync();
            return true; // המחיקה בוצעה בהצלחה
        }

        // פונקציה למציאת משתמש לפי שם משתמש
        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.FirstName == username);
        }

        // פונקציה למציאת משתמש לפי מזהה וכולל את העסק
        public async Task<User?> GetWithBusinessAsync(int userId)
        {
            return await _context.Users
                                 .Include(u => u.Business)  // טוען גם את הנתונים של העסק
                                 .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}