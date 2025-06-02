export interface BusinessDto {
    id: number; // מזהה ייחודי
    businessId: number; // מזהה ייחודי לעסק
    name: string; // שם העסק
    address: string; // כתובת העסק
    email: string; // אימייל של העסק
    businessType: string; // סוג העסק
    equity?: number; // הון עצמי של העסק (אופציונלי)
    income: number; // הכנסות העסק
    expenses: number; // הוצאות העסק
    cashFlow: number; // תזרים מזומנים של העסק
    totalAssets: number; // סך הנכסים של העסק
    totalLiabilities: number; // סך ההתחייבויות של העסק
    netWorth: number; // שווי נקי
    revenueGrowthRate: number; // שיעור צמיחת ההכנסות
    profitMargin: number; // שיעור הרווח
    currentRatio: number; // יחס נוכחי
    quickRatio: number; // יחס מהיר
    createdAt: string; // תאריך יצירה
    createdBy: string; // נוצר על ידי
    updatedAt: string; // תאריך עדכון
    updatedBy: string; // עודכן על ידי
    usersCount: number; // מספר המשתמשים בעסק
}