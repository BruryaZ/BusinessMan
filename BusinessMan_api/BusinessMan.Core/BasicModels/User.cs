using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } // מזהה ייחודי
        public string FirstName { get; set; } // שם פרטי
        public string LastName { get; set; } // שם משפחה
        public string Email { get; set; } // אימייל
        public string Password { get; set; } // סיסמה (מוצפנת)
        public string Phone { get; set; } // מספר פלאפון
        public int Role { get; set; } // תפקיד עובד (admin / user) // 1 = admin, 2 = user, 3 = bookkeeper
        public string IdNumber { get; set; } // תעודת זהות
        public string Status { get; set; } = "active"; // מצב המשתמש (active/inactive)
        public DateTime LastLogin { get; set; } = DateTime.UtcNow; // תאריך כניסה אחרונה
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה
        public string CreatedBy { get; set; } = "";  // נוצר על ידי
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון
        public string UpdatedBy { get; set; } = "";// עודכן על ידי

        // אובייקטים לקשרים בין הטבלאות
        public int? BusinessId { get; set; } = null;// מזהה ייחודי לעסק
        public Business? Business { get; set; } = null;
        public List<Invoice>? Invoices { get; set; } = new List<Invoice>();

        public override string ToString()
        {
            return "Id " + Id + " name " + FirstName;
        }
    }
}