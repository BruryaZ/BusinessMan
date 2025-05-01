import { Business } from "./Business";
import { Invoice } from "./Invoices";

export interface User {
    id: number; // מזהה ייחודי
    firstName: string; // שם פרטי
    lastName: string; // שם משפחה
    email: string; // אימייל
    password: string; // סיסמה (מוצפנת)
    phone: string; // מספר פלאפון
    role: number; // תפקיד עובד (admin / user)
    idNumber: string; // תעודת זהות
    status: string; // מצב המשתמש (active/inactive)
    lastLogin: Date; // תאריך כניסה אחרונה
    createdAt: Date; // תאריך יצירה
    createdBy: string; // נוצר על ידי
    updatedAt: Date; // תאריך עדכון
    updatedBy: string; // עודכן על ידי
    businessId: number | null; // מזהה ייחודי לעסק
    business?: Business | null; // אובייקט עסק
    invoices?: Invoice[]; // רשימת חשבוניות
    // TODO: יכול להיות בעיות עם שדות של תאריך
}