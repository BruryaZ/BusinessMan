import * as Yup from 'yup';

export const validationSchemaBusinessRegister = Yup.object().shape({
  businessId: Yup.number().required('מזהה ייחודי לעסק הוא שדה חובה'),
  name: Yup.string().required('שם העסק הוא שדה חובה'),
  address: Yup.string().required('כתובת העסק היא שדה חובה'),
  email: Yup.string().email('אימייל לא תקין').required('אימייל של העסק הוא שדה חובה'),
  businessType: Yup.string().required('סוג העסק הוא שדה חובה'),
  income: Yup.number().required('הכנסות העסק הן שדה חובה').min(0, 'הכנסות חייבות להיות חיוביות'),
  expenses: Yup.number().required('הוצאות העסק הן שדה חובה').min(0, 'הוצאות חייבות להיות חיוביות'),
  cashFlow: Yup.number().required('תזרים מזומנים של העסק הוא שדה חובה').min(0, 'תזרים חייב להיות חיובי'),
  totalAssets: Yup.number().required('סך הנכסים של העסק הוא שדה חובה').min(0, 'סך הנכסים חייב להיות חיובי'),
  totalLiabilities: Yup.number().required('סך ההתחייבויות של העסק הוא שדה חובה').min(0, 'סך ההתחייבויות חייב להיות חיובי'),
  revenueGrowthRate: Yup.number().nullable().min(0, 'שיעור צמיחת ההכנסות חייב להיות חיובי'),
  profitMargin: Yup.number().nullable().min(0, 'שיעור הרווח חייב להיות חיובי'),
  currentRatio: Yup.number().nullable().min(0, 'יחס נוכחי חייב להיות חיובי'),
  quickRatio: Yup.number().nullable().min(0, 'יחס מהיר חייב להיות חיובי'),
});

export const validationSchemaAdminLogin = Yup.object().shape({
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  password: Yup.string().required('סיסמא היא שדה חובה').min(1, 'סיסמא חייבת להיות לפחות 1 תווים')
})

export const validationSchemaUserLogin = Yup.object().shape({
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  password: Yup.string().required('סיסמא היא שדה חובה').min(1, 'סיסמא חייבת להיות לפחות 3 תווים')
})

export const validationSchemaUserRegister = Yup.object().shape({
  email: Yup.string()
    .email('אימייל לא חוקי')
    .required('אימייל הוא שדה חובה'),

  password: Yup.string()
    .required('סיסמא היא שדה חובה')
    .min(6, 'סיסמא חייבת להיות לפחות 6 תווים')
    .matches(/[A-Z]/, 'סיסמא חייבת להכיל לפחות אות גדולה אחת')
    .matches(/[a-z]/, 'סיסמא חייבת להכיל לפחות אות קטנה אחת')
    .matches(/\d/, 'סיסמא חייבת להכיל לפחות מספר אחד')
    .matches(/[@$!%*?&]/, 'סיסמא חייבת להכיל לפחות תו מיוחד אחד'),

  role: Yup.number()
    .required('תפקיד הוא שדה חובה')
    .min(1, 'תפקיד חייב להיות בין 1 ל-3')
    .max(3, 'תפקיד חייב להיות בין 1 ל-3'),

  phone: Yup.string()
    .required('טלפון הוא שדה חובה')
    .matches(/^05\d{8}$/, 'טלפון חייב להיות מספר נייד תקני'),

  firstName: Yup.string()
    .required('שם פרטי הוא שדה חובה')
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .max(30, 'שם פרטי לא יכול להיות ארוך מ-30 תווים'),

  lastName: Yup.string()
    .required('שם משפחה הוא שדה חובה')
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .max(30, 'שם משפחה לא יכול להיות ארוך מ-30 תווים'),

    idNumber: Yup.string()
    .required('תעודת זהות היא שדה חובה')
    .trim()  // מסיר רווחים בתחילת וסוף המחרוזת
    .matches(/^\d{9}$/, 'תעודת זהות חייבת להיות בדיוק 9 ספרות'),
})

export const validationSchemaAdminRegister = Yup.object().shape({
  email: Yup.string()
    .email('אימייל לא חוקי')
    .required('אימייל הוא שדה חובה'),

  password: Yup.string()
    .required('סיסמא היא שדה חובה')
    .min(6, 'סיסמא חייבת להיות לפחות 6 תווים')
    .matches(/[A-Z]/, 'סיסמא חייבת להכיל לפחות אות גדולה אחת')
    .matches(/[a-z]/, 'סיסמא חייבת להכיל לפחות אות קטנה אחת')
    .matches(/\d/, 'סיסמא חייבת להכיל לפחות מספר אחד')
    .matches(/[@$!%*?&]/, 'סיסמא חייבת להכיל לפחות תו מיוחד אחד'),

  role: Yup.number()
    .required('תפקיד הוא שדה חובה')
    .oneOf([1], 'תפקיד חייב להיות 1'),

  phone: Yup.string()
    .required('טלפון הוא שדה חובה')
    .matches(/^05\d{8}$/, 'טלפון חייב להיות מספר נייד תקני'),

  firstName: Yup.string()
    .required('שם פרטי הוא שדה חובה')
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .max(30, 'שם פרטי לא יכול להיות ארוך מ-30 תווים'),

  lastName: Yup.string()
    .required('שם משפחה הוא שדה חובה')
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .max(30, 'שם משפחה לא יכול להיות ארוך מ-30 תווים'),

    idNumber: Yup.string()
    .required('תעודת זהות היא שדה חובה')
    .trim()  // מסיר רווחים בתחילת וסוף המחרוזת
    .matches(/^\d{9}$/, 'תעודת זהות חייבת להיות בדיוק 9 ספרות'),  
})
