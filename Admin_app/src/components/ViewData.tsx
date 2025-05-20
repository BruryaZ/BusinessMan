import { useContext, useState } from 'react';
import { Business } from '../models/Business';
import BusinessTable from './BusinessTable';
import axios from 'axios';
import { globalContext } from '../context/GlobalContext';

//TODO: לשנות שנתוני העסק יגיעו מהשרת
// const business: Business = {
//     id: 2,
//     businessId: 101,
//     name: "עסק א",
//     address: "כתובת א",
//     email: "businessA@example.com",
//     businessType: "סוג א",
//     income: 100000,
//     expenses: 50000,
//     cashFlow: 50000,
//     totalAssets: 200000,
//     totalLiabilities: 50000,
//     netWorth: 150000,
//     createdAt: new Date(),
//     createdBy: "משתמש א",
//     updatedAt: new Date(),
//     updatedBy: "משתמש ב",
// };


function ViewData() {
    const url = import.meta.env.VITE_API_URL
    const [errors, setErrors] = useState<string[]>([])
    // const [businessId, setBusinessId] = useState<number | null>(0)
    const globalContextDetails = useContext(globalContext);
    const [business, setBusiness] = useState<Business>({
        id: 0, 
        businessId: 0,
        name: "",
        address: "",
        email: "",
        businessType: "",
        income: 0,
        expenses: 0,
        cashFlow: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        createdAt: new Date(),
        createdBy: "",
        updatedAt: new Date(),
        updatedBy: "",
    })

    const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors([]);

        try {                
            const res = await axios.get<Business>(`${url}/api/Business/${globalContextDetails.user.businessId}`, { withCredentials: true });
            if (res.status !== 200) {
                setErrors(['Error fetching business data']);
                return;
            }

            if (!res) {
                setErrors(['No data found']);
                return;
            }

            setBusiness(res.data);
        } catch (error) {
            console.error('Error fetching business data:', error);
            setErrors(['Error fetching business data']);
        }
    }


    return (
        <form onSubmit={handleSubmit()}>
            <div>
                <BusinessTable business={business} />
            </div>

            <button type="submit">צפה בנתונים</button>
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

export default ViewData