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
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  

  //Upon saved Book onClick
  function openModal(book, type, fun) {
    setModalState(prev => ({ ...prev, type: type, open: true, sendData: fun, currBook: book }))
  }
const commonProps = {openModal:openModal, api:api, modalState:modalState, setModalState:setModalState}
const bookProps = {sbooks:sbooks, setSbooks:setSbooks, cbooks:cbooks, setCbooks:setCbooks} 
  return (
    <div className="px-2 pt-2 pb-4">
      <h2 className="text-lg font-medium">Hello, {user.name && user.name}</h2>
      <Book_Section props={commonProps} bookProps={bookProps}/>
  <Goal_Section props={commonProps} bookProps={bookProps}/>
      <History_Section  cbooks={cbooks} props={commonProps}/>
    </div>
  )
}
export default Goal_Page;
