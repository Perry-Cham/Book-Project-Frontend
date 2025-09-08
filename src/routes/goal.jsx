import useAuthStore from '../stores/auth_store'
import Modal from '../components/modal'
import { useState, useEffect, useRef } from 'react'
import Book_Section from './goal_page/books_section'
import Goal_Section from './goal_page/goal_section'
import History_Section from './goal_page/history_section'

function Goal_Page() {
  const api = import.meta.env.VITE_API
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [modalState, setModalState] = useState({
    title: "", message: "", type: "", open: false, sendData:null
  });
  

  //Upon saved Book onClick
  function openModal(book, type, fun) {
    setModalState(prev => ({ ...prev, type: type, open: true, sendData: fun, currBook: book }))
  }

  return (
    <>
      <h2>Hello, {user.name && user.name}</h2>
      <Book_Section openModal={openModal} api={api} modalState={modalState} setModalState={setModalState} />
  <Goal_Section openModal={openModal} api={api} modalState={modalState} setModalState={setModalState} />
      <History_Section api={api} modalState={modalState} setModalState={setModalState} />
    </>
  )
}
export default Goal_Page;
