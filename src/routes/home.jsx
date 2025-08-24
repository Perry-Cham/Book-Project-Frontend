import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuthStore from './stores/auth_store'
import axios from 'axios'
import Book_Card from './components/cards/book_card'
import Modal from './components/modal'
function Home(){
  const api = import.meta.env.VITE_API
  console.log(api, typeof api)
  const [books, setBooks] = useState([]);
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate();
  console.log(user)
  useEffect(() => {
    async function fetchData(){
    try{
    let response = await axios.get(`${api}/allbooks`, {withCredentials:true})
    setBooks(response.data)
    }
    catch(err){
      console.error(err)
    }
  }
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
    setUser(user2)
  }else{
    alert('No session found')
    navigate('/')
  }}catch(err){
    console.error(err)
    navigate('/')
  }
  }
  fetchSession();
  fetchData();
  }, [])
  return(
    <>
      <h2 className="text-center mt-4">Welcome, {user.name && user.name}</h2>
      <p className="text-center">Here's our collection of books you should try</p>
      <Modal />
      {books && books.map((book) =>{
    return (<Book_Card key={book.id}
        book={book}
        />)
      })}
    </>
  )
}

export default Home;