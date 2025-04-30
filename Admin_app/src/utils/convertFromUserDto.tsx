import { User } from "../models/User";
import { UserDto } from "../models/UserDto";

export const converFromUserDto = (userRegister: UserDto): User => {
    return {
        id: userRegister.id, 
        firstName: userRegister.firstName,
        lastName: userRegister.lastName,
        email: userRegister.email,
        password: '******', // יש לוודא שהסיסמה מוצפנת
        phone: userRegister.phone,
        role: userRegister.role,
        idNumber: userRegister.idNumber,
        status: "active", // מצב ברירת מחדל
        createdBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        updatedBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        businessId: undefined, // או מזהה עסק אם יש לך
        business: undefined, // או אובייקט עסק אם יש לך
        invoices: [], // רשימת חשבוניות ריקה או מלאה
        lastLogin: new Date(), // זמן התחברות אחרון, ערך ברירת מחדל
        createdAt: new Date(), // תאריך יצירה
        updatedAt: new Date() // תאריך עדכון
    };
};