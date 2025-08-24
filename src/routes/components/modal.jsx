import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {XMarkIcon} from '@heroicons/react/24/solid'
function Modal({title, message, setPage}){
function  handleSubmit(e){
  const [open, setOpen] = useState(true)
  const location  = useLocation();
  const form = new FormData(e.target)
  const data = form.getpageCount()
  setOpen(false)
  return data
}
function handleClose(){
  setOpen(false)
}
  return(
  open && <div className="w-[100vw] h-[100vh] bg-black bg-opacity-75 fixed top-0 left-0 flex justify-center items-center">
      <div className="p4 bg-white rounded-md">
        <XMarkIcon onClick={handleClose} className="size-6"/>
        <h2>{title}</h2>
        <p>{message}</p>
        {(location.pathname == "/goal" || "/study") &&
        <form onSubmit={(e) => handleSubmit(e)}>
          <label for="pageCount">Enter Page Count (if different from the one stated)</label>
          <input type="text" name="pageCount"/>
          <button type="submit">Set Book</button>
        </form>}
      </div>
    </div>
    )
}
export default Modal;