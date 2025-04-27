import { useState } from "react"
import * as Yup from 'yup'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserRegisterModel } from "../models/UserRegisterModel"

const validationSchema = Yup.object().shape({
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    password: Yup.string().required('סיסמא היא שדה חובה').min(3, 'סיסמא חייבת להיות לפחות 3 תווים')
})

const UserRegister = () => {
    const nav = useNavigate()
    const [user, setUser] = useState<UserRegisterModel>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: 0,
        idNumber: "",
    })
    const [errors, setErrors] = useState<string[]>([])
    const url = import.meta.env.VITE_API_URL

    const handleSubmit = (userRegister: UserRegisterModel) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(userRegister);
        
        validationSchema.isValid(userRegister).then(async valid => {
            setErrors([]);
            if (valid) {
                try {                               // TODO: type 
                    const { data } = await axios.post<UserRegisterModel>(`${url}/Auth/user-register`, userRegister) // TODO 
                    console.log(data);
                    nav('/')
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
        });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target
        setUser(prevUser => ({
            ...prevUser,
            [name]: name === 'role' ? Number(value) : value
          }))          
    }

    return (
        <form onSubmit={handleSubmit(user)}>
            <input type="text" name="firstName" placeholder="שם פרטי" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="שם משפחה" onChange={handleChange} />
            <input type="text" name="phone" placeholder="טלפון" onChange={handleChange} />
            <input type="text" name="idNumber" placeholder="מספר תעודת זהות" onChange={handleChange} />
            <input type="password" name="password" placeholder="סיסמא" onChange={handleChange} />
            {/* <input type="password" name="confirmPassword" placeholder="אשר סיסמא" onChange={handleChange} /> */}
            <input type="text" name="role" placeholder="תפקיד" onChange={handleChange} />
            <input type="email" name="email" placeholder="אימייל" onChange={handleChange} />
            <button type="submit">התחבר</button>

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

export default UserRegister
