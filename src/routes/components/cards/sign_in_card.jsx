import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
function Sign_In_Card({ type }) {
  const navigate = useNavigate()
async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target)
    const data = {
      name: form.get("name"),
      password: form.get("password")
    }
    try{
      const response = await axios.post("http://localhost:3000/signin", data, {
        withCredentials:true
      })
      if (response.status == 200) {
        navigate('/home')
      } else {
        alert('Login Failed')
      }
    }catch (err) {
      console.error(err)
    }
  }

return (
  <form onSubmit={(e) => handleSubmit(e)} method="POST" action={type === "login" ? "http://localhost:3000/signin" : "http://localhost:3000/signup"}>
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