export interface UserDto {
    id:number,
    firstName: string; // שם פרטי
    lastName: string; // שם משפחה
    email: string; // אימייל
    phone: string; // מספר פלאפון
    role: number; // תפקיד עובד (admin / user) // 1 = admin, 2 = user, 3 = bookkeeper
    idNumber: string; // תעודת זהות
    status: string; // מצב המשתמש (active/inactive)
    lastLogin: Date; // תאריך כניסה אחרונה
    createdAt: Date; // תאריך יצירה
    updateAt: Date; // תאריך עדכון
    businessId: number; // מזהה ייחודי לעסק 
}