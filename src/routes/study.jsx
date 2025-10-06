import useAuthStore from '../stores/auth_store'
import axios from 'axios'
import { useState, useEffect} from 'react'
import Timetable from './study_page/timetable'
import Topics from './study_page/topics'

function Study_Page(){
  const {user} = useAuthStore()
    return (
    <section className="px-2 pt-4 pb-4">
      <p className="text-lg font-medium mb-3">Hello {user.name}</p>
      <Timetable />
      <Topics />
    </section>
  )
}

export default Study_Page
