using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> RemoveByEmailAsync(string email);
        Task<User> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate);
    }
}
