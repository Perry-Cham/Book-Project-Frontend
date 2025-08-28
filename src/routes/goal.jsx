import useAuthStore from './stores/auth_store'
import Modal from './components/modal'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
function Goal_Page() {
  const api = import.meta.env.VITE_API
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  const [goal, setGoal] = useState();
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [modalState, setModalState] = useState({
    title: "", message: "", type: "", open: false, sendData:null
  });
  const [currBook, setCurrBook] = useState({})
  useEffect(() => {
    getSavedBooks()
    getCurrentBooks();
    getGoal();
  }, [])


  //Upon saved Book onClick
  function openModal(book, type, fun) {
    book && setCurrBook(book)
    setModalState(prev => ({ ...prev, type: type, open: true, sendData: fun, currBook: book }))
  }

  //Functions that send data to the server
  function setPage(pageCount, type, currBook2) {
   setModalState(() => ({...modalState, open:false})) 

    let data;

    if (type === 'setMax') {
      data = {
        title: currBook2.title,
        cover: currBook2.cover,
        pageCount: pageCount || currBook2.pageCount,
        page: 1,
        mainBook: currBook2._id,
        history: []
      }
    } else {
      data = {
        id: currBook2._id,
        title: currBook2.title,
        pageCount: pageCount
      }
    }
      console.log(modalState, data, currBook)
    handleRead(data, type)
  }

  //Post Requests
  async function handleRead(data, type) {
    const endpoint = type == "setMax" ? "setcurrentbook" : "setcurrentpage";
    try {
      const response = await axios.post(`${api}/${endpoint}`, data, {
        withCredentials: true
      })
      if (response.status == 200) {
        if (modalState.type === "setMax") { alert(`Congratulations you've just started ${response.data.name}`) } else {
          alert(`Congratulations you're now on page ${response.data.page} in ${response.data.title}`)
        }
        getCurrentBooks();
        getSavedBooks();
      
      }
      else {
        alert('Error adding book')
        console.log(response)
      }
    } catch (err) {
      console.error(err)
    }
  }


  async function handleGoal(data) {
    console.log(data)
    try {
      const response = await axios.post(`${api}/setgoal`, data, {
        withCredentials: true
      })
      if (response.status == 200) {
        alert("Congratulations you've just started a new goal. Happy Reading")
      }
      else {
        alert('Error adding book')
        console.log(response)
      }
    } catch (err) {
      console.error(err)
    }
  }


  //Functions that fetch data from the server
  async function getCurrentBooks() {
    try {
      const response = await axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      })
      if (response.status == 200) {
        response.data.length !== 0 ? setCbooks(response.data.currentBooks) : setCbooks(undefined)

      }
      else {
        alert('Error fetching books')
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
        response.data.length !== 0 ? setSbooks(response.data) : setSbooks(undefined)
      } else {
        console.log(response)
        alert('Error fetching books')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getGoal() {
    try {
      const response = await axios.get(`${api}/getgoal`, {
        withCredentials: true
      });
      console.log(response)
      if (response.status == 200) {
        const goal = response.data;
        const spages = goal.currentBooks.reduce((a, b) => a + b.page, 0)
        const tpage = goal.currentBooks.reduce((a, b) => a + b.pageCount, 0)
        goal.pagesRead = spages;
        goal.totalPages = tpage;
        goal.pageView = false;
        setGoal(response.data)
      } else { setGoal(undefined) }
    } catch (err) {
      console.error(err)
      setGoal(undefined)
    }
  }
  //Functions that delete data from the server
  async function handleDelete(id, saved) {
    const isSaved = saved;
    if (isSaved) {
      try {
        const response = await axios.delete(`${api}/deletesaved/${id}`, {
          withCredentials: true
        })
        if (response.status == 200) {
          alert("You have deleted the book successfully")
          getSavedBooks()
        } else {
          alert("Server side error")
        }
      } catch (err) {
        console.error(err)
        alert("Server side error")
      }

    } else {
      try {
        const response = await axios.delete(`${api}/deletecurrent/${id}`, {
          withCredentials: true
        })
        if (response.status == 200) {
          alert("You have deleted the book successfully")
          getCurrentBooks()
        } else {
          console.log(response)
          alert("Server side error current")
        }
      } catch (err) {
        console.error(err)
        alert("Server side error current")
      }
    }
  }

  return (
    <>
      <h2>Hello, {user.name && user.name}</h2>
      {modalState.open && <Modal modalState={modalState} />}
      <section>
        <h2>Currently Reading</h2>
        {cbooks ? cbooks.map((book) =>
          <div key={book._id}>
            <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.pageCount}</p>
            <button onClick={() => openModal(book, "setCurrent", setPage)} className="btn-primary">Set Current Page</button>
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
            <button className="btn-primary" onClick={() => openModal(book, "setMax", setPage)}>Start Reading</button>
            <button className="btn-secondary" onClick={() => handleDelete(book._id, true)}>Delete Book</button>
          </div>) :
          <div>
            <p>You haven't saved anything yet, books you save will appear here</p>
          </div>}
      </section>

      <section>
        <h2>Reading Goals</h2>
        {goal ?
          <div>
            <p>Books to read: {goal.goal.numberOfBooks}</p>
            {goal.pageView ? 
             <div>
              <input type="range" value={goal.pagesRead} max={goal.totalPages} />
              <p>{goal.pagesRead} / {goal.totalPages}</p>
              <p>{Math.ceil((goal.pagesRead / goal.totalPages) * 100)}% complete {goal.pageView ? `of ${goal.currentBooks.length} book(s)`: ""}</p>
              </div>
: 
            <div>
              <input type="range" value={goal.goal.booksRead.length} max={goal.goal.numberOfBooks} />
              <p>{(goal.goal.booksRead.length / goal.goal.numberOfBooks) * 100}% complete </p>
            </div>
            
            }
            
            <button onClick={() => {goal.pageView ? setGoal({...goal, pageView:false}) : setGoal({...goal, pageView:true})}}>Switch to pages view</button>

            <p>
              Ending On: {
                (() => {
                  const end = new Date(goal.goal.endDate);
                  return `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`;
                })()
              }
            </p>
<p>{goal.daysLeft} days left</p>
            <button className="border-2 border-red-600 py-1 px-2 mt-2">Delete Goal</button>
          </div> :
          <div>
            <p>Build a reading habit by setting a reading goal. Once you set one it'll appear here</p>
            <button className="btn-primary" onClick={() => openModal("", "setGoal", handleGoal)}>Set Goal</button>
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
