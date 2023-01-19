import axios, { AxiosError } from "axios"
import { CommentInterface, PostInterface, UserInterface } from "./interfaces"


axios.defaults.baseURL = "http://localhost:8080/"

/* Auth */
export const register = async (username: string, password: string, email: string) => {
    return await axios.post<Response>("/auth/register", { username, password, email })
}

export const login = async (username: string, password: string) => {
    try {
        return await axios.post<Response>("/auth/login", { username, password }, { withCredentials: true })
    } catch (error) {
        throw new Response("Bad username or password!", { status: 401 })
    }
}

export const checkJWT = async () => {
    return await axios.post<Response>("/auth/check", {}, { withCredentials: true })
}

export const logout = async () => {
    localStorage.removeItem("currentUser")
    return await axios.post<Response>("/auth/logout")
}

/* Profile pictures */
export const uploadPicture = async (f: FormData) => {
    return await axios.post("/users/profile", f, { withCredentials: true })
}

export const getPicture = async (id: any) => {
    return await axios.post<Response>(`/users/picture/${id}`)
}

/* User */
export const editUser = async (id: any, u: UserInterface) => {
    return await axios.put<Response>(`/users/${id}`, u, { withCredentials: true })
}

export const deleteUser = async (id: any) => {
    return await axios.delete<Response>(`/users/${id}`, { withCredentials: true })
}

/* Posts */
export const getPosts = async () => {
    const response = await axios.get<Response>("/posts")
    const data = response.data
    return data
}

export const createPost = async (p: PostInterface) => {
    const response = await axios.post<Response>("/posts", { title: p.title, description: p.description, content: p.content }, { withCredentials: true })
    const data = response.data
    return data
}

export const getPostByID = async (id: any) => {
    try {
        const response = await axios.get<Response>(`/posts/${id}`)
        const data = response.data
        return data
    } catch (error) {
        const err = error as AxiosError
        if (err.response?.status === 400) {
            throw new Response("Bad Request", { status: 400 })
        }

        if (err.response?.status === 404) {
            throw new Response("Not Found", { status: 404 })
        }

        if (err.response?.statusText !== "OK") {
            throw new Error("Could not fetch posts")
        }
    }
}

export const deletePostById = async (id: any) => {
    return await axios.delete<Response>(`/posts/${id}`, { withCredentials: true })
}

export const updatePostById = async (id: any, p: PostInterface) => {
    return await axios.put<Response>(`/posts/${id}`, { title: p.title, description: p.description, content: p.content }, { withCredentials: true })
}


/* Comments */
export const getCommentsByPostId = async (id: any) => {
    return await axios.get<Response>(`/comments/${id}`)
}

export const addCommentToPostById = async (id: any, c: CommentInterface) => {
    return await axios.post<Response>(`/comments/${id}`, { content: c.content }, { withCredentials: true })
}

export const deleteCommentFromPostById = async (commentId: any) => {
    return await axios.delete<Response>(`/comments/${commentId}`, { withCredentials: true })
}