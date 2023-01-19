import { Dispatch, SetStateAction } from "react"

export interface PostInterface {
    id?: string,
    title: string,
    description: string,
    content: string,
    author?: string,
    createdAt?: Date,
    updatedAt?: Date,
    authorId?: string,
    comments?: Array<CommentInterface>
}

export interface CommentInterface {
    id?: string,
    content: string,
    post_id?: string,
    author?: string,
    authorId?: string,
    createdAt?: Date,
    updatedAt?: Date,
    rerender?: () => void
}


export interface UserInterface {
    id?: string,
    username: string,
    email: string
}

export interface UserContextInterface {
    currentUser: UserInterface,
    setCurrentUser: Dispatch<SetStateAction<UserInterface>>
}

export interface SearchContextInterface {
    text: string,
    setText: Dispatch<SetStateAction<string>>,
}