using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class Email
    {
        public int Id { get; set; } // מזהה ייחודי
        public string EmailAddress { get; set; } // כתובת האימייל
    }
}
