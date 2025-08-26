import useAuthStore from '../../stores/auth_store'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
function Sign_In_Card({ type }) {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const api = import.meta.env.VITE_API

async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target)
    const data = {
      name: form.get("name"),
      password: form.get("password")
    }
    try{
      const response = await axios.post(e.target.getAttribute('action'), data, {
        withCredentials:true
      })
      if (response.status == 200) {
        setUser(response.data)
        navigate('/home')
      } else {
        alert('Login Failed')
      }
    }catch (err) {
      console.error(err)
    }
  }

return (
  <form onSubmit={(e) => handleSubmit(e)} method="POST" action={type === "login" ? `${api}/signin` : `${api}/signup`}>
    <h2>{type == 'login' ? 'Sign In' : 'Sign Up'}</h2>
    <label for="name">Username</label>
    <input name="name" type="text" placeholder="Perry"></input>
    <label for="password">Password</label>
    <input name="password" type="password"></input>
    <p>Forgot Password</p>
    <button>{type == "login" ? "Sign In" : "Sign Up"}</button>
    {type == "login" && <p>Don't have an account <Link to='/Sign Up'>Sign Up</Link></p>}
  </form>
)
}
export default Sign_In_Card;
