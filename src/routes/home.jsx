import {useState, useEffect} from 'react'
import Book_Card from './components/cards/book_card'
function Home(){
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
    async function fetchData(){
    try{
    let response = await fetch("http://localhost:3000/allbooks")
    let books2 = await response.json()
    setBooks(books2)
    }
    catch(err){
      console.error(err)
    }
  }
    fetchData();
  })
  return(
    <>
      <h2 className="text-center mt-4">Welcome, Perry</h2>
      <p className="text-center">Here's our collection of books you should try</p>
      {books && books.map((book) =>{
    return (<Book_Card key={book.id}
        book={book}
        />)
      })}
    </>
  )
}

export default Home;