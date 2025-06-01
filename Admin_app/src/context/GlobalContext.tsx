import { createContext, ReactElement, useState } from "react"
import { User } from "../models/User"
import { defaultBusiness, defaultUser } from "../models/DefaultObjects"
import { BusinessDto } from "../components/BusinessDto"

type GlobalContextType = {
    business_global: BusinessDto,
    setBusinessGlobal: (business: BusinessDto) => void
    user: User,
    setUser: (user: User) => void
    isAdmin: boolean
    setIsAdmin: (isAdmin: boolean) => void
    usersCount: number,
    setUserCount: (count: number) => void
}

export const globalContext = createContext<GlobalContextType>({
    user: defaultUser,
    setUser: (_: User) => { },
    business_global: defaultBusiness,
    setBusinessGlobal: (_: BusinessDto) => { },
    isAdmin: false,
    setIsAdmin: (_: boolean) => { },
    usersCount: 0,
    setUserCount: (_: number) => { }
})

const GlobalContext = ({ children }: { children: ReactElement }) => {
    const [business_global, setBusinessGlobal] = useState<BusinessDto>(defaultBusiness)
    const [user, setUser] = useState<User>(defaultUser)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [usersCount, setUserCount] = useState<number>(0)

    return <globalContext.Provider value={{ user, setUser, isAdmin, setIsAdmin , business_global, setBusinessGlobal, usersCount, setUserCount }}>
        {children}
    </globalContext.Provider>
}

export default GlobalContext