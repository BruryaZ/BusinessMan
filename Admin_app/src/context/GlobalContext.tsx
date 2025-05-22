import { createContext, ReactElement, useState } from "react"
import { User } from "../models/User"
import { defaultBusiness, defaultUser } from "../models/DefaultObjects"
import { Business } from "../models/Business"

type GlobalContextType = {
    business_global: Business,
    setBusinessGlobal: (business: Business) => void
    user: User,
    setUser: (user: User) => void
    isAdmin: boolean
    setIsAdmin: (isAdmin: boolean) => void
}

export const globalContext = createContext<GlobalContextType>({
    user: defaultUser,
    setUser: (_: User) => { },
    business_global: defaultBusiness,
    setBusinessGlobal: (_: Business) => { },
    isAdmin: false,
    setIsAdmin: (_: boolean) => { }
})

const GlobalContext = ({ children }: { children: ReactElement }) => {
    const [business_global, setBusinessGlobal] = useState<Business>(defaultBusiness)
    const [user, setUser] = useState<User>(defaultUser)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    return <globalContext.Provider value={{ user, setUser, isAdmin, setIsAdmin , business_global, setBusinessGlobal}}>
        {children}
    </globalContext.Provider>
}

export default GlobalContext