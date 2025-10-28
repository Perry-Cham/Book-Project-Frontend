// App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navigation_Bar from './components/navbar'
import LandingPage from './routes/landing'
import Goal_Page from './routes/goal'
import Study_Page from './routes/study'
import Download_Page from './routes/download'
import Library_Page from './routes/library'
import Profile_Page from './routes/profile'
import Auth from './routes/auth'
import Home from './routes/home'
import './css/styles.css'
import api from './utilities/api'
const ProtectedRoute = () => {
  const [auth, isAuth] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(`/getsession`)
        if (response.status === 200) {
          isAuth(true);
        }
      } catch (error) {
        console.error(error);
        Navigate('/')
      }
    };
    checkAuth();
  }, []);

  return (
    !auth ? <>
      <Navigation_Bar />
      <Outlet />  {/* This will render the current route's element */}
    </> : <Navigate to="/" />
  )
}
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
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <LandingPage />
        }
      ]
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
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
          path: '/library',
          element: <Library_Page />
        },
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/profile',
          element: <Profile_Page />
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