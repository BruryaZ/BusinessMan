import { useContext, useState } from "react"
import { Admin } from "../models/Admin"
import * as Yup from 'yup'
import axios from "axios"
import { detailsContext } from "../context/AuthContext"

const validationSchema = Yup.object().shape({
    email: Yup.string().email('אימייל לא חוקי').required('אימייל הוא שדה חובה'),
    password: Yup.string().required('סיסמא היא שדה חובה').min(4, 'סיסמא חייבת להיות לפחות 4 תווים')
})


const AdmineLogin = () => {
    const [admin, setSdmin] = useState<Admin>({})
    const [errors, setErrors] = useState<string[]>([])
    const url = 'https://businessman-api.onrender.com'
    const authDetails = useContext(detailsContext)

    const handleSubmit = (admin: Admin) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validationSchema.isValid(admin).then(async valid => {
            setErrors([]);
            if (valid) {
                console.log('Admin:', admin)
                try {
                    const { data } = await axios.get<any>(`${url}...`) // TODO 
                    // authDetails.setMyBusinessName('aaa')
                }
                catch (e) {
                    console.log(e);
                }
            }
        }).catch((err) => {
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
