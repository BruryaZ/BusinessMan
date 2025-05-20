import { useContext, useEffect, useState } from "react";
import RegisterBusinessData from "./RegisterBusinessData";
import { globalContext } from "../context/GlobalContext";
import axios from "axios";
import { BusinessResponsePutModel } from "../models/BusinessResponsePutModel";
import AdminRegister from "./AdminRegister";
import { UserDto } from "../models/UserDto";

const BusinessAndAdmin = () => {
    const [isBusiness, setIsBusiness] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [businessDone, setBusinessDone] = useState(false);
    const [adminDone, setAdminDone] = useState(false);
    const globalContextDetails = useContext(globalContext)
    const url = import.meta.env.VITE_API_URL

    useEffect(() => {
        if (businessDone && adminDone) {  // OK
            updateObjects()
            // שניהם הסתיימו => אפשר להמשיך לשלב הבא או לנווט
            console.log("הטפסים נוספו בהצלחה");
        }
    }, [businessDone, adminDone]);

    // עדכון קשרים בין עסק למשתמש - מנהל
    const updateObjects = async () => {
        const updateAdmin = {
            ...globalContextDetails.user,
            businessId: globalContextDetails.business_global.id,
            business: globalContextDetails.business_global,
            role: 1,
            updateBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
        }
        const updateBusiness = {
            ...globalContextDetails.business_global,
            users: [globalContextDetails.user],
            updateBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
        }
        globalContextDetails.setUser(updateAdmin)
        globalContextDetails.setBusinessGlobal(updateBusiness)

        try {
            console.log("updateAdmin ", updateAdmin);
            console.log("updateBusiness ", updateBusiness);

            await axios.put<UserDto>(`${url}/api/User/${globalContextDetails.user.id}`, updateAdmin)
        }
        catch (e) {
            console.log(e);
        }

        try {
            await axios.put<BusinessResponsePutModel>(`${url}/api/Business/${globalContextDetails.business_global.id}`, updateBusiness)
            globalContextDetails.setBusinessGlobal(updateBusiness)
            globalContextDetails.setUser(updateAdmin)
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <button onClick={() => { setIsAdmin(!isAdmin) }}>רישום פרטי מנהל</button>
            {isAdmin && <AdminRegister onSubmitSuccess={() => setAdminDone(true)} />}
            <button onClick={() => { setIsBusiness(!isBusiness) }}>רישום פרטי עסק</button>
            {isBusiness && <RegisterBusinessData onSubmitSuccess={() => setBusinessDone(true)} />}
        </div>
    )
}

export default BusinessAndAdmin