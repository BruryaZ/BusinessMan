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
    // TODO: Implement the ExampleService class
    public class ExampleService : IService<Example>
    {
        private readonly IRepositoryManager _repositoryManager;

        public ExampleService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Example?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Examples.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Example>> GetListAsync()
        {
            return await _repositoryManager.Examples.GetAllAsync();
        }

        public async Task<Example> AddAsync(Example example)
        {
            await _repositoryManager.Examples.AddAsync(example);
            await _repositoryManager.SaveAsync(); 
            return example;
        }

        public async Task DeleteAsync(Example item)
        {
            await _repositoryManager.Examples.DeleteAsync(item);
            await _repositoryManager.SaveAsync();
        }

        public async Task<Example?> UpdateAsync(int id, Example item)
        {
            var updatedExample = await _repositoryManager.Examples.UpdateAsync(id, item);
            await _repositoryManager.SaveAsync(); 
            return updatedExample;
        }
    }
}