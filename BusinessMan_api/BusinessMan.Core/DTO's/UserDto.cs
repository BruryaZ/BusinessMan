using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.DTO_s
{
    public class UserDto
    {
        public int Id { get; set; } // מזהה ייחודי
        public string FirstName { get; set; } // שם פרטי
        public string LastName { get; set; } // שם משפחה
        public string Email { get; set; } // אימייל
        public string Phone { get; set; } // מספר פלאפון
        public int Role { get; set; } // תפקיד (admin/user/bookkeeper)
        public string IdNumber { get; set; } // תעודת זהות
        public string Status { get; set; } // מצב המשתמש (active/inactive)
        public DateTime LastLogin { get; set; } = DateTime.UtcNow; // תאריך כניסה אחרונה
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;// תאריך יצירה
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;// תאריך עדכון
        public int? BusinessId { get; set; } // מזהה ייחודי לעסק
    }
}
