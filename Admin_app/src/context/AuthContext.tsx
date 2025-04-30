import { createContext, ReactElement, useState } from "react"

type AuthContextType = {
    user_id: number,
    setMyuserId: (id: number) => void
    business_id: number,
    setMyBusinessId: (id: number) => void
    user_email: string,
    setMyuserEmail: (email: string) => void
    business_name: string,
    setMyBusinessName: (name: string) => void
    user_name: string,
    setMyuserName: (name: string) => void
    user_role: number,
    setMyuserRole: (role: number) => void
}

export const detailsContext = createContext<AuthContextType>({
    user_id: 0,
    setMyuserId: (_: number) => { },
    business_id: 0,
    setMyBusinessId: (_: number) => { },
    user_email: '',
    setMyuserEmail: (_: string) => { },
    business_name: '',
    setMyBusinessName: (_: string) => { },
    user_name: '',
    setMyuserName: (_: string) => { },
    user_role: 0,
    setMyuserRole: (_: number) => { },
})

const AuthContext = ({children}:{children:ReactElement}) => {
    const [user_id, setMyuserId] = useState<number>(0)
    const [business_id, setMyBusinessId] = useState<number>(0)
    const [user_email, setMyuserEmail] = useState<string>('')
    const [business_name, setMyBusinessName] = useState<string>('')
    const [user_name, setMyuserName] = useState<string>('')
    const [user_role, setMyuserRole] = useState<number>(0)
    
    return <detailsContext.Provider value={{ user_id, setMyuserId, business_id, setMyBusinessId, user_email, setMyuserEmail, business_name, setMyBusinessName, user_name, setMyuserName, user_role, setMyuserRole }}>
        {children}
    </detailsContext.Provider>
}

export default AuthContext