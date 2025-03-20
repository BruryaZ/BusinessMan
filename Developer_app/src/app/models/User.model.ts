export class User {
  constructor(
    public firstName: string, // שם פרטי
    public lastName: string, // שם משפחה
    public email: string, // אימייל
    public password: string, // סיסמה (מוצפנת)
    public phone: string, // מספר פלאפון
    public role: number, // תפקיד עובד (admin / user)
    public idNumber: string // תעודת זהות
  ) { }
}