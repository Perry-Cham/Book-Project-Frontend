import useAuthStore from './stores/auth_store'
import Modal from './components/modal'
import { useState, useEffect } from 'react'
import axios from 'axios'
function Goal_Page() {
  const api = import.meta.env.VITE_API
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  const [goal, setGoal] = useState();
  const [modalState, setModalState] = useState({
    title:"",message:"",type:"",open:false
  });
  const [currBook, setCurrBook] = useState({})
  useEffect(() => {
    getSavedBooks()
    getCurrentBooks();
  }, [])
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  //Upon saved Book onClick
  function openModal(book, type) {
    setCurrBook(book)
    setModalState({...modalState, type:type, open:true})
  }

  function setPage(pageCount) {
    setModalState({...modalState, open:false})
    let data;
    
  if(modalState.type === 'setMax'){
    data = {
      title: currBook.title,
      cover: currBook.cover,
      pageCount: pageCount || currBook.pageCount,
      page: 1,
      mainBook: currBook._id,
      history: []
    }}else {
      data = {
        id: currBook._id,
        title:currBook.title,
        pageCount:pageCount
      }
    }
    handleRead(data)
  }



  //To be executed on component mount
  async function handleRead(book) {
    const endpoint = modalState.type == "setMax" ? "setcurrentbook" : "setcurrentpage";
    try {
      const response = await axios.post(`${api}/${endpoint}`, book, {
        withCredentials: true
      })
      if (response.status == 200) {
     if(modalState.type === "setMax"){alert(`Congratulations you've just started ${response.data.name}`)}else{
       alert(`Congratulations you're now on page ${response.data.page} in ${response.data.title}`)
     }
        getCurrentBooks();
        getSavedBooks();
      }
      else {alert('Error adding book')
        console.log(response)
      }
    } catch (err) {
      console.error(err)
    }
  }
  async function getCurrentBooks() {
    try {
      const response = await axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      })
      if(response.status == 200){
        response.data.length !== 0 ? setCbooks(response.data.currentBooks) : setCbooks(undefined)
        console.log(response)
      }
      else {
        alert('Error fetching books')
        console.log(response)
      }
    } catch (err) {
      console.err(err)
      alert('Error fetching books')
    }
  }

  async function getSavedBooks() {
    try {
      const response = await axios.get(`${api}/getsavedbooks`, { withCredentials: true })
      if (response.status == 200) {
        response.data.length !== 0? setSbooks(response.data):setSbooks(undefined)
      } else {
        console.log(response)
        alert('Error fetching books')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getCurrentBooks() {
    try {
      const response = await axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      })
      if(response.status == 200){
        response.data.currentBooks.length !== 0 ? setCbooks(response.data.currentBooks) : setCbooks(undefined)
        console.log(response.data)
      }
      else {
        alert('Error fetching books')
        console.log(response)
      }
    } catch (err) {
      console.error(err)
      alert('Error fetching books')
    }
  }

  async function handleDelete(id,saved){
    const isSaved = saved;
    if(isSaved){
      try{
        const response =  await axios.delete(`${api}/deletesaved/${id}`,{
          withCredentials:true
        })
        if(response.status == 200){
          alert("You have deleted the book successfully")
          getSavedBooks()
        }else{
          alert("Server side error")
        }
      }catch(err){
        console.error(err)
        alert("Server side error")
      }

    }else{
      try{
        const response = await axios.delete(`${api}/deletecurrent/${id}`,{
          withCredentials:true
        })
        if(response.status == 200){
          alert("You have deleted the book successfully")
          getCurrentBooks()
        }else{
          console.log(response)
          alert("Server side error current")
        }
      }catch(err){
        console.error(err)
        alert("Server side error current")
      }
    }
  }
  return (
    <>
      <h2>Hello, {user.name && user.name}</h2>
      {modalState.open && <Modal modalState={modalState} setPage={setPage} />}
      <section>
      <h2>Currently Reading</h2>
      {cbooks ? cbooks.map((book) =>
        <div key={book._id}>
        <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
        <p>{book.title}</p>
        <p>{book.author}</p>
        <p>{book.pageCount}</p>
        <button onClick={() => openModal(book, "setCurrent")} className="btn-primary">Set Current Page</button>
        <button className="btn-secondary" onClick={() => handleDelete(book._id, false)}>Delete Book</button>
        </div>) :
        <div>
        <p>You haven't started reading anything yet, books you read will appear here</p>
        </div>}
        </section>

        <section>
        <h2>Saved Books</h2>
        {sbooks ? sbooks.map((book) =>
          <div key={book._id}>
          <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
          <p>{book.title}</p>
          <p>{book.author}</p>
          <p>{book.pageCount}</p>
          <button className="btn-primary" onClick={() => openModal(book, "setMax")}>Start Reading</button>
          <button className="btn-secondary" onClick={() => handleDelete(book._id,true)}>Delete Book</button>
          </div>) :
          <div>
          <p>You haven't saved anything yet, books you save will appear here</p>
          </div>}
          </section>

      <section>
        <h2>Reading Goals</h2>
        {goal ? <div>Place holder</div> :
          <div>
            <p>Build a reading habit by setting a reading goal. Once you set one it'll appear here</p>
            <button>Set Goal</button>
          </div>
        }
      </section>

      <section>
        <h2>Reading History</h2>
        {cbooks ? <div>
          <p>placeholder</p>
        </div> :
          <div>
            <p>You havent started reading anything yet. You'll see how many pages you've read over past week here</p>
          </div>}
      </section>
    </>
  )
}
export default Goal_Page;
