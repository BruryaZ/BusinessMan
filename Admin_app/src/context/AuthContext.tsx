import { createContext, ReactElement, useState } from "react"

type AuthContextType = {
    admin_id: number,
    setMyAdminId: (id: number) => void
    business_id: number,
    setMyBusinessId: (id: number) => void
    admin_email: string,
    setMyAdminEmail: (email: string) => void
    business_name: string,
    setMyBusinessName: (name: string) => void
}

export const detailsContext = createContext<AuthContextType>({
    admin_id: 0,
    setMyAdminId: (_: number) => { },
    business_id: 0,
    setMyBusinessId: (_: number) => { },
    admin_email: '',
    setMyAdminEmail: (_: string) => { },
    business_name: '',
    setMyBusinessName: (_: string) => { }
})

const AuthContext = ({children}:{children:ReactElement}) => {
    const [admin_id, setMyAdminId] = useState<number>(0)
    const [business_id, setMyBusinessId] = useState<number>(0)
    const [admin_email, setMyAdminEmail] = useState<string>('')
    const [business_name, setMyBusinessName] = useState<string>('')
    
    return <detailsContext.Provider value={{ admin_id, setMyAdminId, business_id, setMyBusinessId, admin_email, setMyAdminEmail, business_name, setMyBusinessName }}>
        {children}
    </detailsContext.Provider>
}

export default AuthContext