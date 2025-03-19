namespace BusinessMan.Core.Models
{
    public class UserPostModel
    {
        public string FirstName { get; set; } // שם פרטי
        public string LastName { get; set; } // שם משפחה
        public string Email { get; set; } // אימייל
        public string Password { get; set; } // סיסמה (מוצפנת)
        public string Phone { get; set; } // מספר פלאפון
        public int Role { get; set; } // תפקיד עובד (admin / user) // 1 = admin, 2 = user, 3 = bookkeeper
        public string IdNumber { get; set; } // תעודת זהות
    }
}
