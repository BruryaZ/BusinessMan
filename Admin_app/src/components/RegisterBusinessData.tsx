import axios from "axios";
import { useState, useContext } from "react";
import { globalContext } from "../context/GlobalContext";
import { BusinessPostModel } from "../models/BusinessPostModel";
import { convertToBusiness } from "../utils/convertToBusiness";
import { validationSchemaBusinessRegister } from "../utils/validationSchema";
import * as Yup from "yup";

const RegisterBusinessData = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const url = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState<string[]>([]);
  const validationSchema = validationSchemaBusinessRegister;
  const globalContextDetails = useContext(globalContext);
  const [businessData, setBusinessData] = useState({
    id: 0,
    businessId: 1, // ערך ברירת מחדל
    name: 'עסק לדוגמה', // ערך ברירת מחדל
    address: 'כתובת לדוגמה', // ערך ברירת מחדל
    email: 'example@business.com', // ערך ברירת מחדל
    businessType: 'סוג עסק לדוגמה', // ערך ברירת מחדל
    income: 10000, // ערך ברירת מחדל
    expenses: 5000, // ערך ברירת מחדל
    cashFlow: 5000, // ערך ברירת מחדל
    totalAssets: 20000, // ערך ברירת מחדל
    totalLiabilities: 10000, // ערך ברירת מחדל
    netWorth: 10000,
    revenueGrowthRate: undefined,
    profitMargin: undefined,
    currentRatio: undefined,
    quickRatio: undefined,
    createdAt: undefined,
    createdBy: '',
    updatedAt: undefined,
    updatedBy: '',
    users: [],
    invoices: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (businessDetails: BusinessPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validationSchema.isValid(businessDetails).then(async valid => {
      setErrors([]);
      if (valid) {
        try {
          const { data } = await axios.post<BusinessPostModel>(`${url}/api/Business`, businessDetails);
          console.log("The data", data);
          globalContextDetails.setBusinessGlobal(convertToBusiness(data));
          console.log("globalContextDetails.business_global", globalContextDetails.business_global);
          console.log("convertToBusiness(data)", convertToBusiness(data));
          
          if (onSubmitSuccess) onSubmitSuccess();
        } catch (e) {
          console.log(e);
        }
      } else {
        setErrors(['Validation error']);
      }
    }).catch((err) => {
      console.log('Validation error:', err.errors);
      if (err instanceof Yup.ValidationError) {
        setErrors(err.errors);
      }
    });
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit(businessData)}>
      <input
        type="number"
        name="businessId"
        placeholder="מזהה ייחודי לעסק"
        value={businessData.businessId} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="text"
        name="name"
        placeholder="שם העסק"
        value={businessData.name} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        placeholder="כתובת העסק"
        value={businessData.address} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="אימייל של העסק"
        value={businessData.email} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="text"
        name="businessType"
        placeholder="סוג העסק"
        value={businessData.businessType} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="number"
        name="income"
        placeholder="הכנסות העסק"
        value={businessData.income} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="number"
        name="expenses"
        placeholder="הוצאות העסק"
        value={businessData.expenses} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="number"
        name="cashFlow"
        placeholder="תזרים מזומנים"
        value={businessData.cashFlow} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalAssets"
        placeholder="סך הנכסים"
        value={businessData.totalAssets} // ערך ברירת מחדל
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalLiabilities"
        placeholder="סך ההתחייבויות"
        value={businessData.totalLiabilities} // ערך ברירת מחדל
        onChange={handleChange}
      />

      <button type="submit">שמור</button>
      
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default RegisterBusinessData;
//TODO להסיר ערכים