import { InvoiceType } from "./Invoices";

export interface InvoiceDto {
    id: number;                // מזהה ייחודי
    amount: number;           // סכום כולל
    amountDebit: number;      // סכום חובה
    amountCredit: number;     // סכום זכות
    invoiceDate: Date;        // תאריך החשבונית
    status: number;           // סטטוס החשבונית
    notes: string;            // הערות
    createdAt: Date;          // תאריך יצירה
    createdBy: string;        // נוצר על ידי
    updatedAt: Date;          // תאריך עדכון
    updatedBy: string;        // עודכן על ידי
    invoicePath: string;      // נתיב החשבונית
    type: InvoiceType;        // סוג העסקה

    userId?: number;          // מזהה המשתמש
    businessId?: number;      // מזהה העסק
}