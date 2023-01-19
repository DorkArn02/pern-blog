import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import { getPostByID, getPosts } from './backend/api'
import Register from './components/Register'
import Login from './components/Login'
import Post from './components/Post'
import NotFound from './components/NotFound'
import ErrorPage from './components/ErrorPage'
import AuthProvider from './context/AuthProvider'
import ProfilePage from './components/ProfilePage'
import WritePost from './components/WritePost'
import SearchProvider from './context/SearchProvider'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),

    children: [
      { path: '', element: <Dashboard />, loader: getPosts },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      { path: '/post/:id', element: <Post />, loader: ({ params }) => getPostByID(params.id), errorElement: <ErrorPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/write", element: <WritePost /> },
      { path: "*", element: <NotFound /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
)