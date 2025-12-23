import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useState} from 'react'
import useAuthStore from '../stores/auth_store'
import { Bars3Icon as Bars } from '@heroicons/react/24/solid'
import useNavStore from '../stores/nav_state_store';
function Navigation_Bar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navIsOpen = useNavStore(state => state.isOpen)
  const api = import.meta.env.VITE_API
  
  
  function handleNav() {
    const nav = document.querySelector('.mobile-nav')
    nav.classList.contains ? nav.classList.toggle('scale-100') : "";
  }
  async function handleLogout() {
   localStorage.removeItem('token')
   setUser({name: "", isLoggedIn: ""})
   navigate('/')
  }
  
  return (
 navIsOpen && <header className="relative shadow-md flex justify-between items-center py-4 pl-4">
      <h2 className="text-lg"><Link to='/'>P'S BOOKS</Link></h2>
      <nav className="hidden md:block">
        <ul className="flex md:justify-center md:items-center">
          <li className="px-4"><Link to="/home">Home</Link></li>
          <li className="px-4"><Link to="/goal">Goals</Link></li>
          <li className="px-4"><Link to="/study">Study</Link></li>
          <li className="px-4"><Link to="/library">Library</Link></li>
          <li className="px-4"><Link to="/profile">{user.name && user.name}</Link></li>
          <li className="px-4 cursor-pointer" onClick={handleLogout}>Logout</li>
        </ul>
      </nav> 

      <nav className={`mobile-nav absolute text-white w-[100vw]  bottom-[-350px] right-0  md:hidden flex justify-center items-center scale-0 transition-transform origin-top-right duration-300  z-50 ${open && "scale-100"}`}>
        <ul className="flex md:justify-center md:items-center flex-col gap-1 rounded-md p-2 bg-blue-800 w-[98%]">
          <li className={`px-4 py-3  ${(location.pathname == '/home' || location.pathname.startsWith('/download')) ? 'active-link' : ""}`}><Link to="/home">Home</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/goal' ? 'active-link' : ""}`}><Link to="/goal">Goals</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/study' ? 'active-link' : ""}`}><Link to="/study">Study</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/library' ? 'active-link' : ""}`}><Link to="/library">Library</Link></li>
          <li className={`px-4 py-3  ${location.pathname == '/profile' ? 'active-link' : ""}`}><Link to="/profile">Profile</Link></li>
          <li className="px-4 py-3">{user.name && <span>{user.name}</span>}</li>
          <li className="px-4 py-3" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      <Bars className="size-7 md:hidden" onClick={() => setOpen(!open)} />
    </header>

  )
}

export default Navigation_Bar;
