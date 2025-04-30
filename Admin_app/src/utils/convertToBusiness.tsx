import { Business } from "../models/Business";
import { BusinessPostModel } from "../models/BusinessPostModel";

export const convertToBusiness = (businessPost: BusinessPostModel): Business => {
    return {
        id: 0, 
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
        invoices: [] // רשימת חשבוניות ריקה או מלאה
    };
};

