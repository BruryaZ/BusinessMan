using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.BasicModels
{
    public class LoginLog
    {
        public int Id { get; set; }
        public int AdminId { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime LoginTime { get; set; } = DateTime.UtcNow;
        public string? UserAgent { get; set; }
        public string? IpAddress { get; set; }
    }
}
