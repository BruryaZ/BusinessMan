import { useContext, useState } from "react"
import { Admin } from "../models/Admin"
import * as Yup from 'yup'
import axios from "axios"
import { detailsContext } from "../context/AuthContext"
import { AdminLoginResponse } from "../models/AdminLoginResponse"
import { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"

const validationSchema = Yup.object().shape({
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    password: Yup.string().required('סיסמא היא שדה חובה').min(3, 'סיסמא חייבת להיות לפחות 3 תווים')
})


const AdmineLogin = () => {
    const nav = useNavigate()
    const [admin, setSdmin] = useState<Admin>({ email: '', password: '' })
    const [errors, setErrors] = useState<string[]>([])
    // const url = 'https://businessman-api.onrender.com'
    const url = `https://localhost:7031`
    const authDetails = useContext(detailsContext)

    const handleSubmit = (adminRegister: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validationSchema.isValid(admin).then(async valid => {

            setErrors([]);

            if (valid) {
                try {
                    const { data } = await axios.post<AdminLoginResponse>(`${url}/Auth/api/admin-login`, adminRegister) // TODO 
                    // הכנסת הטוקן לlocal storage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', data.token);
                    }
                    else{
                        console.log('window is undefined');
                    }
                    // הכנסת הנתונים לקונטקסט
                    authDetails.admin_email = data.user.email
                    authDetails.admin_id = data.user.id
                    authDetails.admin_name = data.user.firstName + " " + data.user.lastName
                    authDetails.admin_role = data.user.role
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
        setSdmin(prevAdmin => ({
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
