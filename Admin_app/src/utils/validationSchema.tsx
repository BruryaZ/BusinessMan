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
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  password: Yup.string().required('סיסמא היא שדה חובה').min(1, 'סיסמא חייבת להיות לפחות 3 תווים'),
  role: Yup.number().required('תפקיד הוא שדה חובה').min(2, 'תפקיד חייב להיות מעל 1').max(3, 'תפקיד חייב להיות בין 2 ל-3'),
})

export const validationSchemaAdminRegister = Yup.object().shape({
  email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
  password: Yup.string().required('סיסמא היא שדה חובה').min(1, 'סיסמא חייבת להיות לפחות 3 תווים'),
})