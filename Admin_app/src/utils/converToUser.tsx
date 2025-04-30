import { User } from "../models/User";
import { UserRegisterModel } from "../models/UserRegisterModel";

export const convertToUser = (userRegister: UserRegisterModel): User => {
    return {
        id: 0, 
        firstName: userRegister.firstName,
        lastName: userRegister.lastName,
        email: userRegister.email,
        password: userRegister.password, // יש לוודא שהסיסמה מוצפנת
        phone: userRegister.phone,
        role: userRegister.role,
        idNumber: userRegister.idNumber,
        status: "active", // מצב ברירת מחדל
        createdBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        updatedBy: '', // תוכל להוסיף את המידע הזה אם יש לך
        businessId: undefined, // או מזהה עסק אם יש לך
        business: undefined, // או אובייקט עסק אם יש לך
        invoices: [] // רשימת חשבוניות ריקה או מלאה
    };
};
