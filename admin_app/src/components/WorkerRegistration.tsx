import React, { useState } from 'react';
import { User } from '../models/User';
import * as Yup from 'yup';

const WorkerRegistation: React.FC = () => {
    const [user, setUser] = useState<User>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 0, // לדוגמה, משתמש רגיל
        idNumber: '',
        businessId: 0,
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<string[]>([]);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('שם פרטי הוא שדה חובה.'),
        lastName: Yup.string().required('שם משפחה הוא שדה חובה.'),
        email: Yup.string().email('אימייל לא חוקי.').required('אימייל הוא שדה חובה.'),
        password: Yup.string().required('סיסמה היא שדה חובה.'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'הסיסמאות אינן תואמות.'),
        phone: Yup.string().required('מספר פלאפון הוא שדה חובה.'),
        idNumber: Yup.string().required('תעודת זהות היא שדה חובה.'),
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (user: User) => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validationSchema.validate(user, { abortEarly: false })
            .then(() => {
                console.log('User:', user);
                setErrors([]);
            })
            .catch((err) => {
                if (err instanceof Yup.ValidationError) {
                    setErrors(err.errors);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit(user)}>
            <input type="text" name="firstName" placeholder="שם פרטי" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="שם משפחה" onChange={handleChange} />
            <input type="email" name="email" placeholder="אימייל" onChange={handleChange} />
            <input type="password" name="password" placeholder="סיסמה" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="אמת סיסמה" onChange={handleChange} />
            <input type="tel" name="phone" placeholder="מספר פלאפון" onChange={handleChange} />
            <input type="text" name="idNumber" placeholder="תעודת זהות" onChange={handleChange} />
            <button type="submit">רשום משתמש</button>

            {errors.length > 0 && (
                <div>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export default WorkerRegistation;