import * as Yup from 'yup';

export const validationSchemaBusinessRegister = Yup.object().shape({
  businessId: Yup.number().required('מזהה ייחודי לעסק הוא שדה חובה'),
  name: Yup.string().required('שם העסק הוא שדה חובה'),
  address: Yup.string().required('כתובת העסק היא שדה חובה'),
  email: Yup.string().email('אימייל לא תקין').required('אימייל של העסק הוא שדה חובה'),
  businessType: Yup.string().required('סוג העסק הוא שדה חובה'),
  income: Yup.number().required('הכנסות העסק הן שדה חובה').positive('הכנסות חייבות להיות חיוביות'),
  expenses: Yup.number().required('הוצאות העסק הן שדה חובה').positive('הוצאות חייבות להיות חיוביות'),
  cashFlow: Yup.number().required('תזרים מזומנים של העסק הוא שדה חובה').positive('תזרים חייב להיות חיובי'),
  totalAssets: Yup.number().required('סך הנכסים של העסק הוא שדה חובה').positive('סך הנכסים חייב להיות חיובי'),
  totalLiabilities: Yup.number().required('סך ההתחייבויות של העסק הוא שדה חובה').positive('סך ההתחייבויות חייב להיות חיובי'),
  // netWorth: Yup.number().required('שווי נקי הוא שדה חובה').positive('שווי נקי חייב להיות חיובי'),
  // revenueGrowthRate: Yup.number().nullable().positive('שיעור צמיחת ההכנסות חייב להיות חיובי'),
  // profitMargin: Yup.number().nullable().positive('שיעור הרווח חייב להיות חיובי'),
  // currentRatio: Yup.number().nullable().positive('יחס נוכחי חייב להיות חיובי'),
  // quickRatio: Yup.number().nullable().positive('יחס מהיר חייב להיות חיובי'),
});

export const validationSchemaAdminLogin = Yup.object().shape({
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  // password: Yup.string().required('סיסמא היא שדה חובה').min(3, 'סיסמא חייבת להיות לפחות 3 תווים') TODO:להחזיר את השדה הזה
})

export const validationSchemaUserLogin = Yup.object().shape({
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    password: Yup.string().required('סיסמא היא שדה חובה').min(3, 'סיסמא חייבת להיות לפחות 3 תווים')
})

export const validationSchemaUserRegister = Yup.object().shape({
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  // password: Yup.string().required('סיסמא היא שדה חובה').min(3, 'סיסמא חייבת להיות לפחות 3 תווים')//TODO :להחזיר את השדה הזה
})