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
  <section className="flex justify-center items-center h-[100vh] bg-theme">
  <form className="rounded-md shadow-md p-4 bg-white h-1/2 max-h-[325px] w-[300px]" onSubmit={(e) => handleSubmit(e)} method="POST" action={type === "login" ? `${api}/signin` : `${api}/signup`}>
    <h2 className="text-xl font-bold mb-3">{type == 'login' ? 'Sign In' : 'Sign Up'}</h2>
    <label for="name">Username</label>
    <br />
    <input className="border-2 pl-2 py-1 mb-2 w-[80%]" name="name" type="text" placeholder="Perry"></input>
    <br />
    <label for="password">Password</label>
     <br />
    <input className="border-2 pl-2 py-1 w-[80%] mb-1" name="password" type="password"></input>
     <br />
    <p>Forgot Password...</p>
    <button className="mt-3 rounded-sm bg-blue-700 text-white px-2 py-1 font-medium">{type == "login" ? "Sign In" : "Sign Up"}</button>
    {type == "login" && <p className="my-5">Don't have an account? <Link className="text-blue-700 font-medium" to='/Sign Up'>Sign Up</Link></p>}
  </form>
  </section>
)
}
export default Sign_In_Card;
