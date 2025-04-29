import { useState } from "react"
import { validationSchemaBusinessRegister } from "../utils/validationSchema";
import { BusinessRegisterModel } from "../models/BusinessRegisterModel";

const RegisterBusinessData = () => {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const validationSchema = validationSchemaBusinessRegister
  const [businessData, setBusinessData] = useState({
    id: 0,
    businessId: 0,
    name: '',
    address: '',
    email: '',
    businessType: '',
    income: 0,
    expenses: 0,
    cashFlow: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
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

  const handleSubmit = (businessDetails: BusinessRegisterModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    
  }

  return (
    <form>
      <input
        type="text"
        name="name"
        placeholder="שם העסק"
        value={businessData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        placeholder="כתובת העסק"
        value={businessData.address}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="אימייל של העסק"
        value={businessData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="businessType"
        placeholder="סוג העסק"
        value={businessData.businessType}
        onChange={handleChange}
      />
      <input
        type="number"
        name="income"
        placeholder="הכנסות העסק"
        value={businessData.income}
        onChange={handleChange}
      />
      <input
        type="number"
        name="expenses"
        placeholder="הוצאות העסק"
        value={businessData.expenses}
        onChange={handleChange}
      />

      <button type="submit">שמור</button>
    </form>
  );
}

export default RegisterBusinessData
