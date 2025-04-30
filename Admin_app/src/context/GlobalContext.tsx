import { createContext, ReactElement, useState } from "react"
import { Business } from "../models/Business"
import { User } from "../models/User"

type GlobalContextType = {
    business_global: Business,
    setBusinessGlobal: (business: Business) => void
    admin: User,
    setAdmin: (admin: User) => void
    user: User,
    setUser: (user: User) => void
}

export const globalContext = createContext<GlobalContextType>({
    business_global: {} as Business,
    setBusinessGlobal: (_: Business) => { },
    admin: {} as User,
    setAdmin: (_: User) => { },
    user: {} as User,
    setUser: (_: User) => { },
})

const GlobalContext = ({children}:{children:ReactElement}) => {
    const [business_global, setBusinessGlobal] = useState<Business>({} as Business)
    const [admin, setAdmin] = useState<User>({} as User)
    const [user, setUser] = useState<User>({} as User)

    return <globalContext.Provider value={{ business_global, setBusinessGlobal, admin, setAdmin, user, setUser }}>
        {children}
    </globalContext.Provider>
}

export default GlobalContext