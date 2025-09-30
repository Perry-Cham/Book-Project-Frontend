// timetable.jsx
import { Dialog, Tab } from '@headlessui/react'
import Study_Modal from './study_modal'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import useAuthStore from '../../stores/auth_store'
function Timetable() {
  const api = import.meta.env.VITE_API
  const [modalState, setModalState] = useState({ heading: "", message: "", open: false })
  const [timetable, setTimetable] = useState(null)
  const [showTableForm, setShowTableForm] = useState(false)
  const {user} = useAuthStore()
  useEffect(() => {
    getTimeTable()
  }, [])

  async function handleSubmit(data) {
    setShowTableForm(false)

    // Transform the data to process session subjects
    const transformedData = data.map(day => {
      if (day.isBreak) {
        return day
      }

      // Process each session's subjects
      const processedSessions = day.sessions.map(session => {
        const subjects = session.subjects ? session.subjects.split(',').map(s => s.trim()) : []
        return {
          ...session,
          subjects: subjects
        }
      })

      return {
        ...day,
        sessions: processedSessions
      }
    })

    let tData = { days: transformedData }

    try {
      const response = await axios.post(`${api}/settimetable`, tData, { withCredentials: true })
      if (response.status === 200) {
        setModalState((prev) => ({ ...prev, open: true, heading: "Congratulations", message: "The timetable has been successfully sent to the server " }))
        getTimeTable()
      }
    } catch (err) {
      console.error(err)
      setModalState((prev) => ({ ...prev, open: true, heading: "Error", message: "The operation failed to complete due to an error on our end, please try again later." }))
    }
  }

  async function handleDelete() {
    try {
      const response = await axios.patch(`${api}/deleteTimetable`, {}, { withCredentials: true })
      response.status === 200 ?
        setModalState({ heading: "Success!", message: "The operation completed successfully.", open: true }) :
        setModalState({ heading: "Failure", message: "There was an error on our end, please try again later", open: true })
      getTimeTable() 
    } catch (err) {
      console.error(err)
      setModalState({ heading: "Failure", message: "There was an error on our end, please try again later", open: true })
    }
  }

  async function getTimeTable() {
    try {
      const response = await axios.get(`${api}/gettimetable`, { withCredentials: true })
      
      if (response.status === 200) {
        setTimetable(() => response.data[0]?.days || null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const todayIndex = new Date().getDay();

  return (
    <section>
      <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
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

      {!showTableForm &&
        <>
          {(timetable && !showTableForm) ? (
            <div>
              <h2 className="text-center text-md font-bold"> {user.name}'s Study Time-Table</h2>
              <Tab.Group defaultIndex={todayIndex}>
                <Tab.List>
                  {days.map((d, index) => (
                    <Tab key={index} className="py-1 px-2 mx-1 my-1 border rounded ui-selected:bg-blue-500 ui-selected:text-white">
                      {d}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-4">
                  {timetable.map((day, index) => (
                    <Tab.Panel key={index} className="p-4 border rounded">
                      <h3 className="text-lg font-bold">{day.day}</h3>
                      {!day.isBreak ? (
                        <div>
                          {day.sessions.map((session, sessionIndex) => (
                            <div key={sessionIndex} className="mb-4 p-3 border rounded">
                              <p className="font-semibold">
                                Session {sessionIndex + 1}: {session.start} to {session.end}
                              </p>
                              {session.subjects && session.subjects.length > 0 ? (
                                <>
                                  <p>Subjects:</p>
                                  <ul className="list-disc list-inside">
                                    {session.subjects.map((subject, subIndex) => (
                                      <li key={subIndex}>{subject}</li>
                                    ))}
                                  </ul>
                                </>
                              ) : (
                                <p>No subjects assigned to this session</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Today is a break day - no studying scheduled</p>
                      )}
              <button className="border-2 border-red-600 py-1 px-2 mt-4" onClick={() => handleDelete()}>
                Delete Timetable
              </button>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          ) : (
            <div>

              <h2>Study Time-Table</h2>
              <p>You haven't made a study timetable yet. When you make a new timetable you'll see it here.</p>
              <button className="btn-secondary" onClick={() => setShowTableForm(true)}>
                Make a new time table
              </button>
            </div>
          )}
        </>}

    </section>
  )
}

export default Timetable