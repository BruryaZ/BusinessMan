import { useContext, useState } from "react"
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


const UserLogin = () => {
    const nav = useNavigate()
    const [user, setUser] = useState<AdminRegister>({ email: "", password: "" })
    const [errors, setErrors] = useState<string[]>([])
    // const url = 'https://businessman-api.onrender.com'
    const url = import.meta.env.VITE_API_URL
 
    const authDetails = useContext(detailsContext)

    const handleSubmit = (userLogin: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validationSchema.isValid(userLogin).then(async valid => {

            setErrors([]);

            if (valid) {
                try {
                    const { data } = await axios.post<AdminLoginResponse>(`${url}/Auth/user-login`, userLogin) // TODO 
                    // הכנסת הטוקן לlocal storage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', data.token);
                    }
                    else {
                        console.log('window is undefined');
                    }
                    // הכנסת הנתונים לקונטקסט
                    authDetails.user_email = data.user.email
                    authDetails.user_id = data.user.id
                    authDetails.user_name = data.user.firstName + " " + data.user.lastName
                    authDetails.user_role = data.user.role
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
