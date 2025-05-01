using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetListAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User> AddAsync(User item);
        Task<User?> UpdateAsync(int id, User item);
        Task DeleteAsync(User item);
        Task<User?> AuthenticateAsync(string username, string password);
        Task<User?> GetUserWithBusinessAsync(int userId);
    }
}
