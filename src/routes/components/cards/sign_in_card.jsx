import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
function Sign_In_Card({type}){
  const navigate = useNavigate()
  function handleSubmit(e){
const form = e.target.parentNode;
form.submit()
/*navigate('/home')*/
  }
  return (
    <form method="POST" action={type === "login" ? "http://localhost:3000/signin" : "http://localhost:3000/signup"}>
      <h2>{type == 'login' ? 'Sign In': 'Sign Up'}</h2>
      <label for="name">Username</label>
      <input name="name" type="text" placeholder="Perry"></input>
      <label  for="password">Password</label>
      <input name="password" type="password"></input>
      <p>Forgot Password</p>
      <button type="submit" onClick={(e) => handleSubmit(e)}>{ type == "login" ?  "Sign In" : "Sign Up"}</button>
    {type == "login" && <p>Don't have an account <Link to='/Sign Up'>Sign Up</Link></p>}
    </form>
    )
}
export default Sign_In_Card;