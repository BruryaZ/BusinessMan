import { Business } from "./Business";
import { User } from "./User";

export enum InvoiceType {
    Income = 0,
    Expense = 1,
    AssetIncrease = 2,
    AssetDecrease = 3,
    LiabilityIncrease = 4,
    LiabilityDecrease = 5,
    EquityIncrease = 6,
    EquityDecrease = 7
}

export interface Invoice {
    id: number;                // מזהה ייחודי
    amountDebit: number;      // סכום חובה
    amountCredit: number;     // סכום זכות
    invoiceDate: Date;        // תאריך החשבונית
    status: number;           // סטטוס החשבונית
    notes?: string;           // הערות
    createdAt?: Date;         // תאריך יצירה
    createdBy?: string;       // נוצר על ידי
    updatedAt?: Date;         // תאריך עדכון
    updatedBy?: string;       // עודכן על ידי
    business?: Business;      // אובייקט עסק
    user?: User;              // אובייקט משתמש
    userId?: number;          // מזהה המשתמש (קשר לטבלת Users)
    businessId?: number;      // מזהה ייחודי לעסק
    type: InvoiceType;        // סוג העסקה (Income, Expense וכו')
}
