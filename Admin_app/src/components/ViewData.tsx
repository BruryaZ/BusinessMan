import { useState } from 'react';
import { Business } from '../models/Business';
import BusinessTable from './BusinessTable';

//TODO: לשנות שנתוני העסק יגיעו מהשרת
const business: Business = {
    id: 1,
    businessId: 101,
    name: "עסק א",
    address: "כתובת א",
    email: "businessA@example.com",
    businessType: "סוג א",
    income: 100000,
    expenses: 50000,
    cashFlow: 50000,
    totalAssets: 200000,
    totalLiabilities: 50000,
    netWorth: 150000,
    createdAt: new Date(),
    createdBy: "משתמש א",
    updatedAt: new Date(),
    updatedBy: "משתמש ב",
};


function ViewData() {
    const url = import.meta.env.VITE_API_URL
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
    


    return (
        <div>
            <BusinessTable business={business} />
        </div>
    )
}

export default ViewData