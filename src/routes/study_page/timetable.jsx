import { Dialog, Tab} from '@headlessui/react'
import Study_Modal from './study_modal'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
function Timetable() {
  const api = import.meta.env.VITE_API
  const [modalState, setModalState] = useState({ heading: "", message: "", open: false })
  const [timetable, setTimetable] = useState(null)
  const [showTableForm, setShowTableForm] = useState(false)
  
  useEffect(() => {
    getTimeTable()
  },[])
  
  async function handleSubmit(data) {
    setShowTableForm(false)
    for (const day of data) {
      const subjects = day.subjects.split(',').map((s) => s.trim())
      day.subjects = subjects
    }
    let tData = { days: data }
    console.log(data)
    try {
      const response = axios.post(`${api}/settimetable`, tData, { withCredentials: true })
      if (response.status = 200) {
        setModalState((prev) => ({ ...prev, open: true, heading: "Congratulations", message: "The timetable has been successfully sent to the server " }))
      }
    } catch (err) {
      console.error(err)
      setModalState((prev) => ({ ...prev, open: true, heading: "Error", message: "The operation failed to complete due to an error on our end, okease try again later." }))
    }
  }
  async function getTimeTable(){
    try{
    const response =  await axios.get(`${api}/gettimetable`,{withCredentials:true})
    if(response.status = 200){
      setTimetable(() => response.data[0].days)
      console.log(response.data[0].days)
    }
    }catch(err){
      console.error(err)
    }
  }
  const days = ["Sun", "Mon","Tue","Wed","Thu","Fri","Sat"]
  return (
    <section>
      <Dialog open={modalState.open} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {modalState.heading}
            </Dialog.Title>
            <Dialog.Description>
              <p>{modalState.message}</p>
            </Dialog.Description>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalState((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
      {showTableForm && <Study_Modal type="timetable" handleSubmit={handleSubmit} />}
      {(timetable && !showTableForm) ? 
        (<div>Placeholder</div>)
        :
        (<div>
          <h2>Study Time-Table</h2>
          <p>You haven't made a study timetable yet, when you make a new timetable you'll see it here.</p>
          <button className="btn-secondary" onClick={() => setShowTableForm(true)}>Make a new time table</button>
        </div>)
      }
          <Tab.Group>
      <Tab.List>
{days.map((d) => (<Tab className="py-1 px-2 mx-1 my-1" key={Math.random()}>{d}</Tab>))}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
        <Tab.Panel>Content 4</Tab.Panel>
        <Tab.Panel>Content 5</Tab.Panel>
        <Tab.Panel>Content 6</Tab.Panel>
        <Tab.Panel>Content 7</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    </section>
  )
}
export default Timetable