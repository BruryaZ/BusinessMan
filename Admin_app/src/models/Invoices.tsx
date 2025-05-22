import { Business } from "./Business";
import { User } from "./User";

export interface Invoice {
    id: number; // מזהה ייחודי
    amountDebit: number; // סכום חובה
    amountCredit: number; // סכום זכות
    invoiceDate: Date; // תאריך החשבונית
    status: number; // סטטוס החשבונית
    notes?: string; // הערות
    createdAt?: Date; // תאריך יצירה
    createdBy?: string; // נוצר על ידי
    updatedAt?: Date; // תאריך עדכון
    updatedBy?: string; // עודכן על ידי
    business?: Business; // אובייקט עסק
    user?: User; // אובייקט משתמש
    userId?: number; // מזהה המשתמש (קשר לטבלת Users)
    businessId?: number; // מזהה ייחודי לעסק
}