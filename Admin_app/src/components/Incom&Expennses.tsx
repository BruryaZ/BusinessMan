import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { InvoiceDto } from "../models/InvoiceDto";
import { globalContext } from "../context/GlobalContext";

const IncomAndExpennses = () => {
    const [income, setIncome] = useState(0);
    const [expenditure, setExpenditure] = useState(0);
    const globalContextDetails = useContext(globalContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        const name = event.target.name;

        if (name === "income") {
            setIncome(Number(value));
        } else if (name === "expenditure") {
            setExpenditure(Number(value));
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const invoiceToSend: InvoiceDto = {
            id: globalContextDetails.user.id,
            amountDebit: expenditure,
            amountCredit: income,
            invoiceDate: new Date(),
            status: 1,
            notes: "",
            createdAt: new Date(),
            createdBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
            updatedAt: new Date(),
            updatedBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
            invoicePath: "",
            userId: globalContextDetails.user.id,
            businessId: globalContextDetails.user.businessId ?? 0
        };
    
        try {
            await axios.post("https://localhost:7031/api/Invoice", invoiceToSend);
        } catch (error) {
            console.error("Error saving invoice:", error);
        }
    };    

    return <form onSubmit={handleSubmit}>
        <h1>נהל את ההכנסות וההוצאות שלך</h1>
        <input type="number" name="expenditure" placeholder="הכנס את ההוצאה שלך" onChange={handleChange} />
        <input type="number" name="income" placeholder="הכנס את ההכנסה שלך" onChange={handleChange} />

        <button type="submit">שלח</button>
    </form>
}

export default IncomAndExpennses;