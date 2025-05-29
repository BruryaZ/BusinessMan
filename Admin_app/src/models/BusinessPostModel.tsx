export interface BusinessPostModel {
    id: number,
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
}