using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class UserLoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int? BusinessId { get; set; } = null;
        public int UserId { get; set; }
        public int Role { get; set; } = 0; // 1 = admin, 2 = user, 3 = bookkeeper
        public string Email { get; set; } = string.Empty;
    }
}
