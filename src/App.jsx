// App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navigation_Bar from './components/navbar'
import LandingPage from './routes/landing'
import Goal_Page from './routes/goal'
import Study_Page from './routes/study'
import Download_Page from './routes/download'
import Auth from './routes/auth'
import Home from './routes/home'
import './css/styles.css'

const Layout = () => {
  return (
    <>
      <Navigation_Bar />
      <Outlet />  {/* This will render the current route's element */}
    </>
  )
}

function App() {
  const api = import.meta.env.VITE_API
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,  // Use the layout for all routes that need navbar
      children: [
        {
          path: '/',
          element: <LandingPage />
        },
        {
          path: '/goal',
          element: <Goal_Page />
        },
        {
          path: '/study',
          element: <Study_Page />
        },
        {
          path: '/download/:id',
          element: <Download_Page />
        },
        {
          path: '/home',
          element: <Home />
        }
      ]
    },
    {
      path: '/signin',
      element: <Auth type="login" />
    },
    {
      path: '/signup',
      element: <Auth type="signup" />
    }
  ])

  return <RouterProvider router={router} />
}

export default App