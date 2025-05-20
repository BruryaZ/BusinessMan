import { useContext, useState } from "react"
import * as Yup from 'yup'
import axios from "axios"
import { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"

const UserLogin = () => {
    const nav = useNavigate()
    const validationSchema = validationSchemaUserLogin
    const [user, setUser] = useState<AdminRegister>({ email: "", password: "" })
    const [errors, setErrors] = useState<string[]>([])
    const url = import.meta.env.VITE_API_URL
    const globalContextDetails = useContext(globalContext);

    const handleSubmit = (userLogin: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validationSchema.isValid(userLogin).then(async valid => {

            setErrors([]);

            if (valid) {
                try {
                    const { data } = await axios.post<any>(`${url}/Auth/user-login`, userLogin) // TODO 
                    globalContextDetails.setUser(data.user);
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
            [name]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit(user)}>
            <input type="email" name="email" placeholder="אימייל" onChange={handleChange} />
            <input type="password" name="password" placeholder="סיסמא" onChange={handleChange} />
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

export default UserLogin
