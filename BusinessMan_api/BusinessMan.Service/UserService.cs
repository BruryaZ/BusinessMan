using BusinessMan.Core.Models;
using BusinessMan.Core.Services;
using BusinessMan.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Service
{
    // TODO: Implement the UserService class 
    public class UserService : IService<User>
    {
        private readonly IRepositoryManager _repositoryManager;

        public UserService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
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
            var updatedUser = await _repositoryManager.User.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync();
            return updatedUser;
        }
    }
}
