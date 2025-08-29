import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios'
function Download_Page() {
  const { id } = useParams();
  const [book, setBook] = useState()
  const api = import.meta.env.VITE_API
  useEffect(() => {
    async function fetchData() {
      try {
        const response= await axios.get(`${api}/download/${id}`, {withCredentials:true})
        setBook(response.data)

      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])
async  function handleSave(id){
    try {
      const response = await axios.post(`${api}/saveBook/${id}`,{}, {withCredentials:true})
      if(response.status == 200){
        console.log(response)
        alert('Your book has been saved to your profile')}else alert('The operation could not be completed')
    }catch(err){
      console.error(err)
      alert('The operation could not be completed')
    }
  }
  return (
    <>
      <h2 className="text-center font-bold text-xl my-4">Welcome To The Download Page</h2>
      {book && <div className="md:grid md:grid-cols-[25%_75%] px-4">
        <div className="grid grid-cols-[50%_50%] gap-4 md:block">
          <img src={book.cover} />
          <div className="md:hidden">
            <p><span className="font-bold">Title</span>:<br />
              {book.title}</p>
            <p><span className="font-bold">Author:</span><br />
              {book.author}</p>
            <p><span className="font-bold">Genre:</span><br />{book.genre}</p>
            <p><span className="font-bold">Page Count:</span><br />{book.pageCount}</p>
          </div>
        </div>
        <article className="box-border">
          <p className="hidden md:block">{book.title}</p>
          <p className="hidden md:block">{book.author}</p>
          <p className="hidden md:block">{book.genre}</p>
          <p className="hidden md:block">{book.pageCount}</p>
          <p className="">{book.synopsis}</p>
          <a href={`https://standardebooks.org/ebooks?query=${encodeURI(book.title)}&sort=default&view=grid&per-page=12`} className="box-border inline-block h-[2.5rem] bg-blue-900 text-white my-5 py-2 px-3">Download Book</a>
<button onClick={() => handleSave(book._id)} className="border-2 border-blue-900 h-[2.5rem] my-5 py-1 px-3 ml-4">Save To Read Later</button>
        </article>
      </div>}
    </>
  )
}
export default Download_Page;
