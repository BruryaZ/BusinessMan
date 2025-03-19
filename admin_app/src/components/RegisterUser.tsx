import { useContext, useState } from "react";
import { Admin } from "../models/Admin";
import * as Yup from 'yup';
import axios from "axios";
import { detailsContext } from "../context/AuthContext";

const validationSchema = Yup.object().shape({
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    password: Yup.string().required('סיסמא היא שדה חובה').min(4, 'סיסמא חייבת להיות לפחות 4 תווים'),
    firstName: Yup.string().required('שם פרטי הוא שדה חובה'),
    lastName: Yup.string().required('שם משפחה הוא שדה חובה'),
    phone: Yup.string().required('מספר פלאפון הוא שדה חובה'),
    idNumber: Yup.string().required('תעודת זהות היא שדה חובה'),
    businessType: Yup.string().required('סוג העסק הוא שדה חובה'),
    role: Yup.number().required('תפקיד הוא שדה חובה').oneOf([1, 2, 3], 'תפקיד לא חוקי'),
});

const RegisterUser = () => {
    const [admin, setAdmin] = useState<Admin>({});
    const [errors, setErrors] = useState<string[]>([]);
    const url = 'https://businessman-api.onrender.com';
    const authDetails = useContext(detailsContext);

    const handleSubmit = (admin: Admin) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const valid = await validationSchema.isValid(admin);
            setErrors([]);
            if (valid) {
                console.log('Admin:', admin);
                const { data } = await axios.post<any>(`${url}/api/admin/register`, admin);
                // authDetails.setMyBusinessName(data.businessName); // עדכון שם העסק
            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                setErrors(err.errors);
            } else {
                setErrors(['שגיאה בשליחת הנתונים, אנא נסה שוב.']);
                console.error(err);
            }
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = event.target;
        setAdmin(prevAdmin => ({
            ...prevAdmin,
            [name]: value
        }));
    }

    return (
        <div>
            <form onSubmit={handleSubmit(admin)}>
                <input type="text" name="firstName" placeholder="שם פרטי" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="שם משפחה" onChange={handleChange} />
                <input type="email" name="email" placeholder="אימייל" onChange={handleChange} />
                <input type="password" name="password" placeholder="סיסמא" onChange={handleChange} />
                <input type="text" name="phone" placeholder="מספר פלאפון" onChange={handleChange} />
                <input type="text" name="idNumber" placeholder="תעודת זהות" onChange={handleChange} />

                <select name="businessType" onChange={handleChange}>
                    <option value="">בחר סוג עסק</option>
                    <option value="type1">ניהול חשבון משפחתי</option>
                    <option value="type2">יבואן</option>
                    <option value="type3">עסק עצמאי</option>
                    <option value="type4">אומנות</option>
                    <option value="type5">ניהול חנות</option>
                    <option value="type6">שיווק מוצרים</option>
                    {/* <option value="type7"></option> */}
                </select>

                <select name="role" onChange={handleChange}>
                    <option value="">בחר תפקיד</option>
                    <option value="1">מנהל (admin)</option>
                    <option value="2">משתמש (user)</option>
                    <option value="3">רואה חשבון (bookkeeper)</option>
                </select>

                <button type="submit">התחבר</button>

                {errors.length > 0 && (
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}

export default RegisterUser;
