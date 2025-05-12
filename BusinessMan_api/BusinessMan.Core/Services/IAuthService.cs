using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(int userId, int? businessId, string userName, int role, string email);
    }
}
