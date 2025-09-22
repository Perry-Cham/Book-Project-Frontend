import useAuthStore from '../stores/auth_store'
import { Dialog } from '@headlessui/react'
import Study_Modal from './study_page/study_modal'
import axios from 'axios'
import { useState, useEffect} from 'react'
function Study_Page(){
  const api = import.meta.env.VITE_API
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isOpen, setIsOpen] = useState(true)
 async function handleSubmit (data){
   for(const day of data){
     const subjects = day.subjects.split(',').map((s) => s.trim())
     day.subjects = subjects
   }
   let tData = {days: data}
   console.log(data)
   try{
        const response = axios.post(`${api}/settimetable`,tData, {withCredentials:true})
        if(response.status = 200){
          alert('Timetable is created')
        }
      }catch(err){
        console.error(err)
      } 
  }
    return (
    <section>
      <p>Hello, {user.name}</p>
{/*      <Dialog open={true} onClose={() => setIsOpen(false)}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => setIsOpen(false)}>Deactivate</button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
      </Dialog.Panel>
    </Dialog> */}
      <Study_Modal type="timetable" handleSubmit={handleSubmit} />
    </section>
  )
}

export default Study_Page
