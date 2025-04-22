import React from 'react';
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

const App: React.FC = () => {
    return (
        <div>
            <h1>נתוני עסק</h1>
            <BusinessTable business={business} />
        </div>
    );
};

export default App;
