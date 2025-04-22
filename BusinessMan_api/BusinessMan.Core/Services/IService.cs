using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Services
{
    public interface IService<T> where T : class
    {
        Task<IEnumerable<T>> GetListAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> AddAsync(T item);
        Task<T?> UpdateAsync(int id, T item);
        Task DeleteAsync(T item);
    }
}
