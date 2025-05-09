using BusinessMan.Core.Models;
using BusinessMan.Core.Repositories;
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
    public class BusinessService : IService<Business>
    {
        private readonly IRepositoryManager _repositoryManager;

        public BusinessService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Business?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Business.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Business>> GetListAsync()
        {
            return await _repositoryManager.Business.GetAllAsync();
        }

        public async Task<Business> AddAsync(Business business)
        {
            await _repositoryManager.Business.AddAsync(business);
            await _repositoryManager.SaveAsync(); 
            return business;
        }

        public async Task DeleteAsync(Business business)
        {
            await _repositoryManager.Business.DeleteAsync(business);
            await _repositoryManager.SaveAsync(); 
        }

        public async Task<Business?> UpdateAsync(int id, Business item)
        {
            item.UpdatedAt = DateTime.UtcNow;
            var updatedBusiness = await _repositoryManager.Business.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync(); 
            return updatedBusiness;
        }
    }
}
