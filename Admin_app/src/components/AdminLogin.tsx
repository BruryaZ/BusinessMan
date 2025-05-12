import { useContext, useState } from "react"
import { Admin } from "../models/Admin"
import * as Yup from 'yup'
import axios from "axios"
// import { detailsContext } from "../context/AuthContext"
import { AdminLoginResponse } from "../models/AdminLoginResponse"
import { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaAdminLogin } from "../utils/validationSchema"

const AdmineLogin = () => {
    const nav = useNavigate()
    const [admin, setAdmin] = useState<Admin>({ email: '', password: '' })
    const [errors, setErrors] = useState<string[]>([])
    const url = import.meta.env.VITE_API_URL 
    // const authDetails = useContext(detailsContext)
    const validationSchema = validationSchemaAdminLogin

    const handleSubmit = (adminRegister: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validationSchema.isValid(admin).then(async valid => {

            setErrors([]);

            if (valid) {
                try {
                    const res = await axios.post<any>(`${url}/Auth/admin-login`, adminRegister) // TODO 
                    console.log(res.data);
                    
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
        setAdmin(prevAdmin => ({
            ...prevAdmin,
            [name]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit(admin)}>
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

export default AdmineLogin
