export class User {
  constructor(
    public id: number, // מזהה ייחודי של המשתמש
    public businessId: number, // מזהה העסק שאליו המשתמש שייך
    public status: string, // סטטוס המשתמש (active / inactive)
    public lastLogin: Date, // תאריך כניסה אחרון
    public createdAt: Date, // תאריך יצירת המשתמש
    public updatedAt: Date, // תאריך עדכון אחרון
    public firstName: string, // שם פרטי
    public lastName: string, // שם משפחה
    public email: string, // אימייל
    public password: string, // סיסמה (מוצפנת)
    public phone: string, // מספר פלאפון
    public role: number, // תפקיד עובד (admin / user)
    public idNumber: string // תעודת זהות
  ) { }
}