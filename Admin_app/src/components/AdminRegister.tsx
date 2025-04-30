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
    const nav = useNavigate()
    const validationSchema = validationSchemaUserRegister
    const [myAdmin, setMyAdmin] = useState<UserRegisterModel>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: 0,
        idNumber: "",
    })
    const [errors, setErrors] = useState<string[]>([])
    const globalContextDetails = useContext(globalContext)
    const url = import.meta.env.VITE_API_URL

    const handleSubmit = (adminRegister: UserRegisterModel) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(adminRegister);

        validationSchema.isValid(adminRegister).then(async valid => {
            setErrors([]);
            if (valid) {
                try {                               // TODO: type 
                    const { data } = await axios.post<UserDto>(`${url}/Auth/admin-register`, adminRegister) // TODO 
                    console.log(data);
                    if (data.role == 2)
                        globalContextDetails.setUser(converFromUserDto(data))
                    else if (data.role == 1)
                        globalContextDetails.setAdmin(converFromUserDto(data))
                    if (onSubmitSuccess)
                        onSubmitSuccess();
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
        setMyAdmin(prevUser => ({
            ...prevUser,
            [name]: name === 'role' ? Number(value) : value,
            role: 1
        }))
    }

    return (
        <form onSubmit={handleSubmit(myAdmin)}>
            <input type="text" name="firstName" placeholder="שם פרטי" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="שם משפחה" onChange={handleChange} />
            <input type="text" name="phone" placeholder="טלפון" onChange={handleChange} />
            <input type="text" name="idNumber" placeholder="מספר תעודת זהות" onChange={handleChange} />
            <input type="password" name="password" placeholder="סיסמא" onChange={handleChange} />
            {/* <input type="password" name="confirmPassword" placeholder="אשר סיסמא" onChange={handleChange} /> */}
            <input type="email" name="email" placeholder="אימייל" onChange={handleChange} />
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

export default AdminRegister
