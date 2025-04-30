export interface UserRegisterModel {
    firstName: string; // שם פרטי
    lastName: string; // שם משפחה
    email: string; // אימייל
    password: string; // סיסמה (מוצפנת)
    phone: string; // מספר פלאפון
    role: number; // תפקיד עובד (admin / user) // 1 = admin, 2 = user, 3 = bookkeeper
    idNumber: string; // תעודת זהות
}

