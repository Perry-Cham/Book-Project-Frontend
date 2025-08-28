import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/solid'
function Modal({ modalState }) {
  const [open, setOpen] = useState(true)
  const condition = location.pathname === "/goal" || location.pathname === "/study";
  const api = import.meta.env.VITE_API
  function handleClose() {
    setOpen(false)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (modalState.type !== "setGoal") {
      const form = new FormData(e.target)
      const data = form.get("pageCount")
      modalState.sendData(data)
    } else {
      const form = new FormData(e.target)
     const data = {
        numberOfBooks: form.get("numberOfBooks"),
        duration: form.get("duration"),
        unit: form.get("unit")
      }
      modalState.sendData(data);
    }

  }

  return (
    open && <div className="w-[100vw] h-[100vh] bg-black bg-opacity-75 fixed top-0 left-0 flex justify-center items-center">

      <div className="p-[1.75rem] bg-white rounded-md md:w-[300px] min-w-[200px]">
        <XMarkIcon onClick={handleClose} className="size-6 cursor-pointer text-right" />
        <h2>{modalState.title}</h2>
        <p>{modalState.message}</p>

        {(condition && modalState.type == "setMax" || modalState.type == "setCurrent") &&
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="pageCount">{modalState.type === "setMax" ? "Enter Page Count (if different from the one stated)" : "Enter The Page You're On Now"}</label>
            <input className="border-2 rounded-md focus:border-blue-800 p-2" type="number" name="pageCount" />
            <button className="btn-secondary rounded-md mt-3" type="submit">Set Book</button>
          </form>}

        {modalState.type == "setGoal" &&
          <form onSubmit={(e) => handleSubmit(e)}>
            <h2>Set a Reading Goal</h2>
            <label htmlFor="">Number of Books</label>
            <input className="block" type="Number" name="numberOfBooks" value="3"/>
            <label htmlFor="">Duration</label>
            <input className="block" type="Number" name="duration"/>
            <label htmlFor="unit">Unit Of Measurement</label>
            <br></br>
          <input className="capitalize" type="radio" name="unit"  id="day" value="day"/>
          <label for="day">Day(s)</label><br/>
          <input className="capitalize" type="radio" name="unit"  id="week" value="week"  selected />
          <label for="week">Week(s)</label><br/>
            <button className="btn-primary">Submit</button>
          </form>
        }
      </div>
    </div>
  )
}
export default Modal;
