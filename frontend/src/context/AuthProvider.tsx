import { createContext, useEffect, useState } from 'react'
import { UserContextInterface, UserInterface } from '../backend/interfaces'

interface props {
    children: JSX.Element | JSX.Element[]
}

export const AuthContext = createContext<UserContextInterface | null>(null)

export default function AuthProvider({ children }: props) {
    const [currentUser, setCurrentUser] = useState<UserInterface>(JSON.parse(localStorage.getItem('currentUser') || "{}") || {})

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser))
        }
    }, [currentUser])


    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}
