import { Invoice } from "./Invoices";
import { User } from "./User";

export interface Business {
    usersCount: number;
    id: number; // מזהה ייחודי
    businessId: number; // מזהה ייחודי לעסק
    name: string; // שם העסק
    address: string; // כתובת העסק
    email: string; // אימייל של העסק
    businessType: string; // סוג העסק
    income: number; // הכנסות העסק
    expenses: number; // הוצאות העסק
    cashFlow: number; // תזרים מזומנים של העסק
    totalAssets: number; // סך הנכסים של העסק
    totalLiabilities: number; // סך ההתחייבויות של העסק
    netWorth: number; // שווי נקי
    revenueGrowthRate?: number; // שיעור צמיחת ההכנסות
    profitMargin?: number; // שיעור הרווח
    currentRatio?: number; // יחס נוכחי
    quickRatio?: number; // יחס מהיר
    createdAt?: Date; // תאריך יצירה
    createdBy?: string; // נוצר על ידי
    updatedAt?: Date; // תאריך עדכון
    updatedBy?: string; // עודכן על ידי
    users?: User[]; // רשימת משתמשים
    invoices?: Invoice[]; // רשימת חשבוניות
}

export class BusinessImpl implements Business {
    id: number;
    businessId: number;
    name: string;
    address: string;
    email: string;
    businessType: string;
    income: number;
    expenses: number;
    cashFlow: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    revenueGrowthRate?: number;
    profitMargin?: number;
    currentRatio?: number;
    quickRatio?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    users?: User[];
    invoices?: Invoice[];

    constructor(
        id: number,
        businessId: number,
        name: string,
        address: string,
        email: string,
        businessType: string,
        income: number,
        expenses: number,
        cashFlow: number,
        totalAssets: number,
        totalLiabilities: number,
        netWorth: number,
        revenueGrowthRate?: number,
        profitMargin?: number,
        currentRatio?: number,
        quickRatio?: number,
        createdAt?: Date,
        createdBy?: string,
        updatedAt?: Date,
        updatedBy?: string,
        users?: User[],
        invoices?: Invoice[]
    ) {
        this.id = id;
        this.businessId = businessId;
        this.name = name;
        this.address = address;
        this.email = email;
        this.businessType = businessType;
        this.income = income;
        this.expenses = expenses;
        this.cashFlow = cashFlow;
        this.totalAssets = totalAssets;
        this.totalLiabilities = totalLiabilities;
        this.netWorth = netWorth;
        this.revenueGrowthRate = revenueGrowthRate;
        this.profitMargin = profitMargin;
        this.currentRatio = currentRatio;
        this.quickRatio = quickRatio;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.users = users;
        this.invoices = invoices;
    }
    usersCount!: number;
}