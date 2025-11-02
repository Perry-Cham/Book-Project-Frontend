import Study_Modal from './study_modal'
import { Dialog, Tab } from '@headlessui/react'
import { useState, useEffect } from 'react'
import useAuthStore from '../../stores/auth_store'
import api from '../../utilities/api'
function Topics() {
  const [goalData, setGoalData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [modalState, setModalState] = useState({ heading: "", message: "", open: false })
  const {user} = useAuthStore();
  useEffect(() => {
    getTopics();
  }, [])
  async function getTopics() {
    try {
      const response = await api.get(`/getstudygoal`, {
        withCredentials: true
      })
      console.log(response)
      if (response.status === 200) {
        setGoalData(response.data)
        setShowForm(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function handleSubmit(data) {
    let tData = data;
    tData.topics = tData.topics.split(",").map(topic => ({
      name: topic.trim(),
      completed: false
    }))
    try {
      const response = await api.post(`/setstudygoal`, tData, { withCredentials: true })
      if (response.status === 200) {
        setModalState((prev) => ({ ...prev, open: true, heading: "Congratulations", message: "The operation completed successfully" }))
        getTopics() // Refresh the timetable
      }
    } catch (err) {
      console.error(err)
      setModalState((prev) => ({ ...prev, open: true, heading: "Error", message: "The operation failed to complete due to an error on our end, please try again later." }))
    }
  }
  async function handleDelete(subject) {
    try {
      const response = await api.patch(`/deletestudygoal`, { subject: subject }, { withCredentials: true })
      if (response.status == 200) {
        setModalState((prev) => ({ ...prev, open: true, heading: "Congratulations", message: "The operation completed successfully" }))
        getTopics()
      }
    } catch (err) {
      console.error(err)
      setModalState((prev) => ({ ...prev, open: true, heading: "Error", message: "The operation failed to complete due to an error on our end, please try again later." }))
      getTopics()
    }
  }
  async function handleTopicComplete(topic){
    const data = {...goalData}
   for(const subject of data){
     const index = subject.topics.findIndex(el => el.name == topic)
     if(index > -1){
       subject.topics[index].completed = true;
       break;
     }
   }
  }
  return (
    <section className="bg-white rounded-md py-3 mt-5">
      {(showForm) && <Study_Modal type="topics" handleSubmit={handleSubmit} />}

  <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {modalState.heading}
            </Dialog.Title>
            <Dialog.Description>
              {modalState.message}
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
      <div>
        {(goalData && !showForm) && (
          <>
            <h2 className="text-center text-md font-bold">{user.name} Study Targets</h2>
            <Tab.Group className="px-3 py-2">
              <Tab.List>
                {goalData && goalData.map(subject => (
              <Tab className="border px-2 py-1 mr-2 rounded-md" key={Math.random() + Date.now()}>
                {subject.subject}
              </Tab>
            ))}
              </Tab.List>
              <Tab.Panels>
                {goalData && goalData.map(subject => (
              <Tab.Panel className="px-3 py-3 border-2 mt-2 rounded-md" key={Math.random() + Date.now()}>
                <h3 className="">Topics</h3>
                <ul>
                  {subject.topics.map(topic => (
                    <li onClick={() => handleTopicComplete(topic.name)}className={`border rounded-lg ${topic.completed && 'border-blue-800 border-2'}`} key={Math.random() + Date.now()}>
                      <p>{topic.name}</p>
                    {!topic.completed && <button classname="btn-primary" onClick={async () => {
                        const copy = [...goalData]
                        const parent = copy.find(el => el.subject === subject.subject)
                        const index = parent.topics.indexOf(topic)
                        parent.topics[index].completed = true;
                        setGoalData(copy)
                        try {
                          const response = await api.patch('/completegoal', {subject:subject.subject, topics:subject.topics})
                          console.log(response)
                        } catch (error) {
                          console.error(error)
                        }
                      }}>Mark as completed</button>} 
                    </li>))}
                </ul>
                <p>Deadline: {subject.endDate}</p>
                <button className="border-2 border-red-600 p-1 hover:bg-red-600 hover:text-white" onClick={() => handleDelete(subject.subject)}>Delete Study Goal</button>
              </Tab.Panel>
            ))}
              </Tab.Panels>
            <button className="btn-secondary mt-4" onClick={() => setShowForm(true)}>
              Set a new target
            </button>
            </Tab.Group>
          </>
        )}
        {(!goalData && !showForm) && (
          <div className="px-2"> 
            <h2>Study Targets</h2>
            <p>You haven't set any study targets yet. When you make a new target you'll see it here.</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              Set a new target
            </button>
          </div>
        )
        }
      </div>

    </section>
  )
}
export default Topics