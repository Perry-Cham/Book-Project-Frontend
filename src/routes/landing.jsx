import {Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import useAuthStore from './stores/auth_store'
import axios from 'axios'
import SectionCard from './components/cards/section_card';
function LandingPage (){
/*  useEffect(() => {
async  function fetchSession(){
  const userSession = await axios.get('http://localhost:3000/getsession', {
    withCredentials:true
  });
  console.log(userSession)
  if(userSession.status == 200){
    const user2 = {
      name:userSession.data.name,
      loggedIn:true
    }
    console.log(user2)
    setUser(user2)
    navigate('/home')
  }else{
    alert('No session found')
    navigate('/')
  }
  }
  fetchSession();
},[]) */
  return(
  <>
<SectionCard 
heading={"Welcome to P's Books"}
mainText={"A project of mine to nurture reading and the love the of it of course."}
imgClass={"col-start-2"}
bodyClass={"col-start-1"}
/>
<SectionCard 
heading={"Save Books To Read Later"}
mainText={"You can save books to your profile so that you never lose them. Then you can come back to them later when you feel like scartching that literary itch."}
imgClass={"col-start-1"}
bodyClass={"col-start-2"}
/>
<SectionCard
heading={"Set Goals To Keep Track Of Progress"}
mainText={"Perfect for students who want to be accountablebwith their studies or get through a baclog of work"}
imgClass={"col-start-2"}
bodyClass={"col-start-1"}
/>
<SectionCard 
heading={"Download Books To Your Device"}
mainText={"If you find one particularly interesting your free to download it and share it with someone else."}
imgClass={"col-start-1"}
bodyClass={"col-start-2"}
/>
<section className="min-h-[25vh] flex justify-center items-center flex-col">
  <h2 className="text-center my-4 text-uppercase">Get Started</h2>
  <div className="flex justify-center items-center">
  <button className="box-border h-[2rem] w-[6rem] bg-blue-900 text-white px-4 mx-4"><Link to='/signin'>Login</Link></button>
  <button className="box-border h-[2rem] w-[6rem] border-2 border-blue-900 px-4 mx-4"><Link to='/signup'>Sign Up</Link></button>
  </div>
</section>
  </>)
}
export default LandingPage; 