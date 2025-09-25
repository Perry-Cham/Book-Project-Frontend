// study_modal.jsx
import { useState } from 'react'

function Study_Modal({ type, handleSubmit }) {
  const [timeTable, setTimeTable] = useState(null)
  const [target, setTarget] = useState(null)
  const [timetableForm, setTimetableForm] = useState([])
  const [targetForm, setTargetForm] = useState({ subject: '', topics: '' })
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const updateTimetableDayData = (day, field, value) => {
    setTimetableForm(prev => {
      const existingIndex = prev.findIndex(d => d.day === day)
      
      const dayData = existingIndex !== -1 
        ? { ...prev[existingIndex] } 
        : { 
            day: day, 
            isBreak: false, 
            numSessions: 1, 
            sessions: [{ start: '', end: '', subjects: '' }] 
          }
      
      dayData[field] = value

      if (field === 'numSessions') {
        const num = parseInt(value) || 1
        dayData.sessions = Array.from({ length: num }, (_, i) =>
          dayData.sessions[i] || { start: '', end: '', subjects: '' }
        )
      }
      
      if (field === 'sessions') {
        dayData.sessions = value
      }

      if (existingIndex !== -1) {
        const newArray = [...prev]
        newArray[existingIndex] = dayData
        return newArray
      } else {
        return [...prev, dayData]
      }
    })
  }

  const updateSessionField = (day, sessionIndex, field, value) => {
    setTimetableForm(prev => {
      const existingIndex = prev.findIndex(d => d.day === day)
      
      if (existingIndex === -1) {
        const newDayData = { 
          day: day, 
          isBreak: false, 
          numSessions: 1, 
          sessions: Array.from({ length: 1 }, (_, i) => 
            i === sessionIndex ? { ...{ start: '', end: '', subjects: '' }, [field]: value } : { start: '', end: '', subjects: '' }
          )
        }
        return [...prev, newDayData]
      }
      
      const dayData = { ...prev[existingIndex] }
      const updatedSessions = [...dayData.sessions]
      
      if (!updatedSessions[sessionIndex]) {
        updatedSessions[sessionIndex] = { start: '', end: '', subjects: '' }
      }
      
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        [field]: value
      }
      
      dayData.sessions = updatedSessions
      
      const newArray = [...prev]
      newArray[existingIndex] = dayData
      return newArray
    })
  }

  const transformTopics = (topicsString) => {
    return topicsString.split(',').map(topic => topic.trim()).filter(Boolean).map(name => ({
      name,
      completed: false
    }))
  }

  function sendData(e) {
    e.preventDefault()
    handleSubmit(timetableForm)
  }

  return (
    <div>
      {type === 'timetable' ? 
        <form onSubmit={(e) => sendData(e)}>
          {days.map((day) => {
            const entry = timetableForm.find(d => d.day === day)
            const dayData = entry || { 
              day: day, 
              isBreak: false, 
              numSessions: 1, 
              sessions: [{ start: '', end: '', subjects: '' }] 
            }
            
            return (
              <div key={day} className="day-entry mb-4 p-2 border">
                <label htmlFor={`day-${day}`}>{day}</label><br />
                
                <label>Make this day a break day?</label>
                <input
                  type="checkbox"
                  checked={dayData.isBreak}
                  onChange={(e) => updateTimetableDayData(day, 'isBreak', e.target.checked)}
                /><br />
                
                {!dayData.isBreak && (
                  <>
                    <label>Number of sessions for {day}:</label><br />
                    <input
                      className="block border"
                      type="number"
                      min="1"
                      value={dayData.numSessions}
                      onChange={(e) => updateTimetableDayData(day, 'numSessions', e.target.value)}
                    /><br />
                    
                    {dayData.sessions.map((session, i) => (
                      <div key={i} className="session-entry ml-4 mb-4 p-2 border">
                        <h4>Session {i + 1}</h4>
                        
                        <label>Start Time:</label><br />
                        <input
                          type="time"
                          value={session.start || ''}
                          onChange={(e) => updateSessionField(day, i, 'start', e.target.value)}
                        /><br />
                        
                        <label>End Time:</label><br />
                        <input
                          type="time"
                          value={session.end || ''}
                          onChange={(e) => updateSessionField(day, i, 'end', e.target.value)}
                        /><br />
                        
                        <label>Subjects for this session (comma-separated):</label><br />
                        <input
                          type="text"
                          value={session.subjects || ''}
                          onChange={(e) => updateSessionField(day, i, 'subjects', e.target.value)}
                          className="border"
                          placeholder="e.g., Mathematics,Physics"
                        /><br />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
          <button type="submit" onClick={handleSubmit} className="btn-primary">Save Timetable</button>
        </form>
        :
        <form className="px-2 py-3">
          <label>Enter the subject/course name</label><br />
          <input
            type="text"
            value={targetForm.subject}
            onChange={(e) => setTargetForm(prev => ({ ...prev, subject: e.target.value }))}
            className="border"
          /><br />
          <label>Enter the desired topics, [space topics with a comma (e.g microbiology,physiology,psycology e.t.c)]</label><br />
          <input
            type="text"
            value={targetForm.topics}
            onChange={(e) => setTargetForm(prev => ({ ...prev, topics: e.target.value }))}
            className="border"
          /><br />
          <button type="submit" className="btn-primary mt-1">Save Target</button>
        </form>
      }
    </div>
  )
}

export default Study_Modal