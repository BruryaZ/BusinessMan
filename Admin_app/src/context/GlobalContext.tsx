import { createContext, ReactElement, useState } from "react"
import { Business } from "../models/Business"
import { User } from "../models/User"
import { defaultBusiness, defaultUser } from "../models/DefaultObjects"

type GlobalContextType = {
    business_global: Business,
    setBusinessGlobal: (business: Business) => void
    admin: User,
    setAdmin: (admin: User) => void
    user: User,
    setUser: (user: User) => void
    num: number
    setNum: (num: number) => void
}

export const globalContext = createContext<GlobalContextType>({
    user: defaultUser,
    setUser: (_: User) => { },
    business_global: defaultBusiness,
    setBusinessGlobal: (_: Business) => { },
    admin: defaultUser,
    setAdmin: (_: User) => { },
    num: 0,
    setNum: (_: number) => { }
})

const GlobalContext = ({children}:{children:ReactElement}) => {
    const [business_global, setBusinessGlobal] = useState<Business>(defaultBusiness)
    const [admin, setAdmin] = useState<User>(defaultUser)
    const [user, setUser] = useState<User>(defaultUser)
    const [num, setNum] = useState<number>(0)

    return <globalContext.Provider value={{ business_global, setBusinessGlobal, admin, setAdmin, user, setUser, num, setNum }}>
        {children}
    </globalContext.Provider>
}

export default GlobalContext

//todo: למחוק את נם