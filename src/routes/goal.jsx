import useAuthStore from './stores/auth_store'
import { useState, useEffect } from 'react'
import axios from 'axios'
function Goal_Page() {
  const api = import.meta.env.VITE_API
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  const [goal, setGoal] = useState();
  useEffect(() => {
    getSavedBooks()
  }, [])
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  //To be executed on component mount
  async function getSavedBooks() {
    try {
      const response = await axios.get(`${api}/getsavedbooks`, { withCredentials: true })
      if (response.status == 200) {
        setSbooks(response.data)
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
      const response = axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      })
      if(response.status == 200){setCbooks(response.data)}
      else alert('Error fetching books')
    } catch (err) {
      console.err(err)
    }
  }
  async function getReadingGoals() {
    try {
      const response = axios.get(`${api}/getreadgoal`, {
        withCredentials: true
      })
      if(response.status == 200){setGoal(response.data)}
      else alert('Error fetching goals')
    } catch (err) {
      console.err(err)
    }
  }
  async function handleRead(book) {
 try {
      const response = axios.post(`${api}/setcurretbook/`,book, {
        withCredentials: true
      })
      if(response.status == 200){alert(`Congratulations you've just started ${response.data.name}`)}
      else alert('Error adding book')
    } catch (err) {
      console.err(err)
    }
  }
  return (
    <>
      <h2>Hello, {user.name && user.name}</h2>
      
      <section>
        <h2>Currently Reading</h2>
        {cbooks ? cbooks.map((book) =>
          <div>
            <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.pageCount}</p>
            <button>Set Current Page</button>
          </div>) :
          <div>
            <p>You haven't started reading anything yet, books you read will appear here</p>
          </div>}
      </section>
      
      <section>
        <h2>Saved Books</h2>
        {sbooks ? sbooks.map((book) =>
          <div>
            <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.pageCount}</p>
            <button onClick={() => handleRead(book)}>Start Reading</button>
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