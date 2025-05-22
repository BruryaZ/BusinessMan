import { useContext, useState } from 'react';
import { Business } from '../models/Business';
import axios from 'axios';
import { globalContext } from '../context/GlobalContext';
import BusinessTable from './BusinessTable';

function ViewData() {
    const url = import.meta.env.VITE_API_URL
    const [errors, setErrors] = useState<string[]>([])
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