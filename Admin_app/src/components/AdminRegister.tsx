import { useContext, useState } from "react"
import * as Yup from 'yup'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserRegisterModel } from "../models/UserRegisterModel"
import { validationSchemaUserRegister } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { UserDto } from "../models/UserDto"
import { converFromUserDto } from "../utils/convertFromUserDto"

const AdminRegister = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
    const nav = useNavigate();
    const validationSchema = validationSchemaUserRegister;
    const [myAdmin, setMyAdmin] = useState<UserRegisterModel>({
        firstName: "יוסי", // ערך ברירת מחדל
        lastName: "כהן", // ערך ברירת מחדל
        email: "a@a", // ערך ברירת מחדל
        password: "Password123", // ערך ברירת מחדל
        phone: "050-1234567", // ערך ברירת מחדל
        role: 1, // ערך ברירת מחדל
        idNumber: "123456789", // ערך ברירת מחדל
    });
    const [errors, setErrors] = useState<string[]>([]);
    const globalContextDetails = useContext(globalContext);
    const url = import.meta.env.VITE_API_URL;

    const handleSubmit = (adminRegister: UserRegisterModel) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        validationSchema.isValid(adminRegister).then(async valid => {
            setErrors([]);
            if (valid) {
                try {
                    const { data } = await axios.post<UserDto>(`${url}/Auth/admin-register`, adminRegister);
                    console.log("data ", data);
                    if (data.role == 2)
                        globalContextDetails.setUser(converFromUserDto(data));
                    else if (data.role == 1)
                    {
                        globalContextDetails.setAdmin(converFromUserDto(data));
                    }
                    if (onSubmitSuccess)
                        onSubmitSuccess();
                    
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
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setMyAdmin(prevUser => ({
            ...prevUser,
            [name]: name === 'role' ? Number(value) : value,
        }));
    }

    return (
        <form onSubmit={handleSubmit(myAdmin)}>
            <input type="text" name="firstName" placeholder="שם פרטי" value={myAdmin.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="שם משפחה" value={myAdmin.lastName} onChange={handleChange} />
            <input type="text" name="phone" placeholder="טלפון" value={myAdmin.phone} onChange={handleChange} />
            <input type="text" name="idNumber" placeholder="מספר תעודת זהות" value={myAdmin.idNumber} onChange={handleChange} />
            <input type="password" name="password" placeholder="סיסמא" value={myAdmin.password} onChange={handleChange} />
            <input type="email" name="email" placeholder="אימייל" value={myAdmin.email} onChange={handleChange} />
            <button type="submit">שמור</button>

            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
        </form>
    )
}

export default AdminRegister;

// TODO להסיר ערכים