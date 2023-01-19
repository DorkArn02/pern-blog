import { createContext, useState } from 'react'
import { SearchContextInterface } from '../backend/interfaces'

interface props {
    children: JSX.Element | JSX.Element[]
}

export const SearchContext = createContext<SearchContextInterface | null>(null)

export default function SearchProvider({ children }: props) {

    const [text, setText] = useState<string>("")

    return (
        <SearchContext.Provider value={{ text, setText }}>
            {children}
        </SearchContext.Provider>
    )
}
