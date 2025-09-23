import useAuthStore from '../stores/auth_store'
import axios from 'axios'
import { useState, useEffect} from 'react'
import Timetable from './study_page/timetable'
function Study_Page(){
  const {user} = useAuthStore()
    return (
    <section>
      <p>Hello, {user.name}</p>
      <Timetable />
    </section>
  )
}

export default Study_Page
