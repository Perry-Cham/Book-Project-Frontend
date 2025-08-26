import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {XMarkIcon} from '@heroicons/react/24/solid'
function Modal({modalState, setPage}){
  const [open, setOpen] = useState(true)
  const condition = location.pathname === "/goal" || location.pathname === "/study";
  const api = import.meta.env.VITE_API
function handleClose(){
  setOpen(false)
}
function handleSubmit(e){
  e.preventDefault()
  const form = new FormData(e.target)
  const data = form.get("pageCount")
  setPage(data)
}

  return(
    open && <div className="w-[100vw] h-[100vh] bg-black bg-opacity-75 fixed top-0 left-0 flex justify-center items-center">

     <div className="p-[1.75rem] bg-white rounded-md md:w-[300px] min-w-[200px]">
        <XMarkIcon onClick={handleClose} className="size-6 cursor-pointer text-right"/>
        <h2>{modalState.title}</h2>
        <p>{modalState.message}</p>
        
        {condition &&
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="pageCount">{modalState.type === "setMax" ? "Enter Page Count (if different from the one stated)" : "Enter The Page You're On Now"}</label>
          <input className="border-2 rounded-md focus:border-blue-800 p-2" type="number" name="pageCount"/>
          <button className="btn-secondary rounded-md mt-3"  type="submit">Set Book</button>
        </form>}
      </div>
    </div>
    )
}
export default Modal;
