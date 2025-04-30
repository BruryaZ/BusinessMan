import { createContext, useState } from "react";
import RegisterBusinessData from "./RegisterBusinessData";
import UserRegister from "./UserRegister";
import { globalContext } from "../context/GlobalContext";

const BusinessAndAdmin = () => {
    const [isBusiness, setIsBusiness] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const globalContextDetails = createContext(globalContext)

    const handleUpdateData = (){
        
    }

    return (
        <div>
            <button onClick={() => { setIsAdmin(true) }}>רישום פרטי מנהל</button>
            {isAdmin && <UserRegister onUpdate={handleUpdateData} />} {/**TODO:: למצוא דרך לעדכן את הקשרים בין האוביייקטים */}
            <button onClick={() => { setIsBusiness(true) }}>רישום פרטי עסק</button>
            {isBusiness && <RegisterBusinessData />}
        </div>
    )
}

export default BusinessAndAdmin
