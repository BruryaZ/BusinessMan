import { useContext, useState } from "react"
import { validationSchemaBusinessRegister } from "../utils/validationSchema";
import * as Yup from "yup";
import { BusinessPostModel } from "../models/BusinessPostModel";
import axios from "axios";
import { globalContext } from "../context/GlobalContext";
import { convertToBusiness } from "../utils/convertToBusiness";

const RegisterBusinessData = () => {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const validationSchema = validationSchemaBusinessRegister
  const globalContextDetails = useContext(globalContext)
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

  const handleSubmit = (businessDetails: BusinessPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validationSchema.isValid(businessDetails).then(async valid => {
      setErrors([]);
      if (valid) {
        try {
          const { data } = await axios.post<BusinessPostModel>(`${url}//api/Business`, businessDetails)
          console.log(data);
          globalContextDetails.setBusinessGlobal(convertToBusiness(businessDetails))
        }
        catch (e) {
          console.log(e);
        }
      }
      else {
        setErrors(['Validation error']);
      }
    }).catch((err) => {
      console.log('Validation error:', err.errors);
      if (err instanceof Yup.ValidationError) {
        setErrors(err.errors);
      }
    }
    );
    setErrors([]);
  }

  return (
    <form onSubmit={handleSubmit(businessData)}>
      <input
        type="number"
        name="businessId"
        placeholder="מזהה ייחודי לעסק"
        onChange={handleChange}
      />
      <input
        type="text"
        name="name"
        placeholder="שם העסק"
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        placeholder="כתובת העסק"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="אימייל של העסק"
        onChange={handleChange}
      />
      <input
        type="text"
        name="businessType"
        placeholder="סוג העסק"
        onChange={handleChange}
      />
      <input
        type="number"
        name="income"
        placeholder="הכנסות העסק"
        onChange={handleChange}
      />
      <input
        type="number"
        name="expenses"
        placeholder="הוצאות העסק"
        onChange={handleChange}
      />
      <input
        type="number"
        name="cashFlow"
        placeholder="תזרים מזומנים"
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalAssets"
        placeholder="סך הנכסים"
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalLiabilities"
        placeholder="סך ההתחייבויות"
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

export default RegisterBusinessData
