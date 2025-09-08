import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuthStore from '../stores/auth_store'
import axios from 'axios'
import Book_Card from '../components/cards/book_card'
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
  fetchData();
  }, [])
  return(
    <>
      <h2 className="text-center mt-4">Welcome, {user.name && user.name}</h2>
      <p className="text-center">Here's our collection of books you should try</p>
      {books && books.map((book) =>{
    return (<Book_Card key={book.id}
        book={book}
        type={"homeBook"}
        />)
      })}
    </>
  )
}

export default Home;