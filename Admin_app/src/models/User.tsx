import { Business } from "./Business";
import { Invoice } from "./Invoices";

export interface User {
    id: number; // מזהה ייחודי
    firstName: string; // שם פרטי
    lastName: string; // שם משפחה
    email: string; // אימייל
    password: string; // סיסמה (מוצפנת)
    confirmPassword?: string; // אימות סיסמה
    phone: string; // מספר פלאפון
    role: number; // תפקיד עובד (admin / user)
    idNumber: string; // תעודת זהות
    status?: string; // מצב המשתמש (active/inactive)
    businessId: number; // מזהה ייחודי לעסק
    lastLogin?: Date; // תאריך כניסה אחרונה
    createdAt?: Date; // תאריך יצירה
    createdBy?: string; // נוצר על ידי
    updatedAt?: Date; // תאריך עדכון
    updatedBy?: string; // עודכן על ידי
    business?: Business; // אובייקט עסק
    invoices?: Invoice[]; // רשימת חשבוניות
}