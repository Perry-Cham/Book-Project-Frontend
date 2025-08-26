import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useEffect} from 'react'
import axios from 'axios'
import useAuthStore from '../stores/auth_store'
import { Bars3Icon as Bars } from '@heroicons/react/24/solid'

function Navigation_Bar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser)
  
  useEffect(() => {
    fetchSession();
  }, [])
async  function fetchSession(){
    try{
  const userSession = await axios.get('http://localhost:3000/getsession', {
    withCredentials:true
  });
  console.log(userSession)
  if(userSession.status == 200){
    const user2 = {
      name:userSession.data.name,
      loggedIn:true
    }
    const link = location.pathname == "/" ? "/home" : location.pathname
    setUser(user2)
    navigate(link)
  }}catch(err){
    console.error(err)
    navigate('/')
  }}
  
  function handleNav() {
    const nav = document.querySelector('.mobile-nav')
    nav.classList.contains ? nav.classList.toggle('scale-100') : "";
  }
  async function handleLogout() {
    try {
      const response = await axios.get('http://localhost:3000/logout', {
        withCredentials:true
      })
      if (response.status == 200) navigate('/'); else alert('logout failed')
    } catch (err) {
      console.error(err)
      alert('failed')
    }
  }
  
  return (
 (location.pathname !== '/signin' && location.pathname !== '/signup') && <div className="relative shadow-md flex justify-between items-center py-4 pl-4 ">
      <h2 className="text-lg"><Link to='/'>P'S BOOKS</Link></h2>
      <nav className="hidden md:block border-2">
        <ul className="border-2 flex md:justify-center md:items-center">
          <li className="px-4"><Link to="/home">Home</Link></li>
          <li className="px-4"><Link to="/goal">Goals</Link></li>
          <li className="px-4"><Link to="/study">Study</Link></li>
          <li className="px-4" onClick={handleLogout}>Logout</li>
        </ul>
      </nav> 

      <nav className="mobile-nav absolute text-white w-[100vw]  bottom-[-230px] right-0  md:hidden flex justify-center items-center scale-0 transition-transform origin-top-right duration-300  ">
        <ul className="flex md:justify-center md:items-center flex-col gap-1 rounded-md p-2 bg-blue-800 w-[98%]">
          <li className={`px-4 py-3  ${(location.pathname == '/home' || location.pathname.startsWith('/download')) ? 'active-link' : ""}`}><Link to="/home">Home</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/goal' ? 'active-link' : ""}`}><Link to="/goal">Goals</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/study' ? 'active-link' : ""}`}><Link to="/study">Study</Link></li>
          <li className="px-4 py-3" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      <Bars className="size-7 md:hidden" onClick={handleNav} />
    </div>

  )
}

export default Navigation_Bar;