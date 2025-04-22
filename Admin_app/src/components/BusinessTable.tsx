import React from 'react';
import { Business } from '../models/Business';

interface BusinessTableProps {
    business: Business;
}

const BusinessTable: React.FC<BusinessTableProps> = ({ business }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>שם עסק</th>
                    <th>כתובת</th>
                    <th>אימייל</th>
                    <th>סוג עסק</th>
                    <th>הכנסות</th>
                    <th>הוצאות</th>
                    <th>תזרים מזומנים</th>
                    <th>שווי נקי</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{business.id}</td>
                    <td>{business.name}</td>
                    <td>{business.address}</td>
                    <td>{business.email}</td>
                    <td>{business.businessType}</td>
                    <td>{business.income}</td>
                    <td>{business.expenses}</td>
                    <td>{business.cashFlow}</td>
                    <td>{business.netWorth}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default BusinessTable;