import { Business } from "../models/Business";
import { BusinessDto } from "../models/BusinessDto";
import { BusinessPostModel } from "../models/BusinessPostModel";

export const convertToBusiness = (businessPost: BusinessPostModel): Business => {
    return {
        id: businessPost.id, 
        netWorth:  businessPost.expenses - businessPost.income, // חישוב שווי נקי
        businessId: businessPost.businessId,
        name: businessPost.name,
        address: businessPost.address,
        email: businessPost.email,
        businessType: businessPost.businessType,
        income: businessPost.income,
        expenses: businessPost.expenses,
        cashFlow: businessPost.cashFlow,
        totalAssets: businessPost.totalAssets,
        totalLiabilities: businessPost.totalLiabilities,
        revenueGrowthRate: undefined, // או חישוב אם יש לך ערך
        profitMargin: undefined, // או חישוב אם יש לך ערך
        currentRatio: undefined, // או חישוב אם יש לך ערך
        quickRatio: undefined, // או חישוב אם יש לך ערך
        createdAt: new Date(), // תאריך יצירה נוכחי
        createdBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        updatedAt: new Date(), // תאריך עדכון נוכחי
        updatedBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        users: [], // רשימת משתמשים ריקה או מלאה
        invoices: [], // רשימת חשבוניות ריקה או מלאה
        usersCount: 0 // מספר משתמשים התחלתי
    };
};

export const convertToBusinessDto = (data: Business): BusinessDto => ({
    id: data.id,
    businessId: data.businessId,
    name: data.name,
    address: data.address,
    email: data.email,
    businessType: data.businessType,
    income: data.income,
    expenses: data.expenses,
    cashFlow: data.cashFlow,
    totalAssets: data.totalAssets,
    totalLiabilities: data.totalLiabilities,
    usersCount: data.usersCount,
    netWorth: 0,
    revenueGrowthRate: 0,
    profitMargin: 0,
    currentRatio: 0,
    quickRatio: 0,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : data.createdAt?.toISOString() || "",
    createdBy: data.createdBy || "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : data.updatedAt?.toISOString() || "",
    updatedBy: data.updatedBy || "",
})
