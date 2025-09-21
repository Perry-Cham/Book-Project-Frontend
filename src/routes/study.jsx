import useAuthStore from '../stores/auth_store'
import Modal from '../components/modal'
import Study_Modal from './study_page/study_modal'
import { useState, useEffect} from 'react'
function Study_Page(){
  const api = import.meta.env.VITE_API
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  function handleSubmit (data){
      console.log(data)
    for(const day in data){
      console.log(day)
    }
  }
    return (
    <section>
      <p>Hello, {user.name}</p>
      <Study_Modal type="timetable" handleSubmit={handleSubmit} />
    </section>
  )
}

export default Study_Page
