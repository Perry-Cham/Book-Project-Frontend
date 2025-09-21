import { useState } from 'react'
function Study_Modal({ type, handleSubmit}) {
  const [timeTable, setTimeTable] = useState(null)
  const [target, setTarget] = useState(null)
  const [timetableForm, setTimetableForm] = useState({})
  const [targetForm, setTargetForm] = useState({ subject: '', topics: '' })
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  const updateTimetableDayData = (day, field, value) => {
    setTimetableForm(prev => {
      const currentDay = prev[day] || { subjects: '', isBreak: false, numSessions: 1, sessions: [{ start: '', end: '' }] }
      let updatedDay = { ...currentDay, [field]: value }

      // If numSessions changes, update sessions array
      if (field === 'numSessions') {
        const num = parseInt(value) || 1
        updatedDay.sessions = Array.from({ length: num }, (_, i) =>
          currentDay.sessions[i] || { start: '', end: '' }
        )
      }

      return { ...prev, [day]: updatedDay }
    })
  }
  
  const transformTopics = (topicsString) => {
    return topicsString.split(',').map(topic => topic.trim()).filter(Boolean).map(name => ({
      name,
      completed: false
    }))
  }
  
  function sendData(e){
    e.preventDefault()
    handleSubmit(timetableForm)
  }
  return (
    <div>
      {type === 'timetable' ? <form onSubmit={(e) => sendData(e)}>
        {days.map((day) => {
          const dayData = timetableForm[day] || { subjects: '', isBreak: false, numSessions: 1, sessions: [{ start: '', end: '' }] }
          return (
            <div key={day} className="day-entry mb-4 p-2 border">
              <label htmlFor={`day-${day}`}>{day}</label><br />
              <label>Subjects (comma-separated):</label><br />
              <input
                type="text"
                value={dayData.subjects}
                onChange={(e) => updateTimetableDayData(day, 'subjects', e.target.value)}
              /><br />
              <label>Make this day a break day?</label>
              <input
                type="checkbox"
                checked={dayData.isBreak}
                onChange={(e) => updateTimetableDayData(day, 'isBreak', e.target.checked)}
              /><br />
              {!dayData.isBreak && (
                <>
                  <label>Number of custom sessions for {day}:</label><br />
                  <input
                    className="block"
                    type="number"
                    min="1"
                    value={dayData.numSessions}
                    onChange={(e) => updateTimetableDayData(day, 'numSessions', e.target.value)}
                  /><br />
                  {dayData.sessions.map((session, i) => (
                    <div key={i} className="session-entry ml-4">
                      <p>Session {i + 1}</p>
                      <label>Start Time:</label><br />
                      <input
                        type="time"
                        value={session.start}
                        onChange={(e) => {
                          const newSessions = [...dayData.sessions]
                          newSessions[i] = { ...newSessions[i], start: e.target.value }
                          updateTimetableDayData(day, 'sessions', newSessions)
                        }}
                      /><br />
                      <label>End Time:</label><br />
                      <input
                        type="time"
                        value={session.end}
                        onChange={(e) => {
                          const newSessions = [...dayData.sessions]
                          newSessions[i] = { ...newSessions[i], end: e.target.value }
                          updateTimetableDayData(day, 'sessions', newSessions)
                        }}
                      /><br />
                    </div>
                  ))}
                </>
              )}
            </div>
          )
        })}
        <button type="submit" className="btn-primary">Save Timetable</button>
      </form>
        :
        <form>
          <label>Enter the subject/course name</label>
          <input
            type="text"
            value={targetForm.subject}
            onChange={(e) => setTargetForm(prev => ({ ...prev, subject: e.target.value }))}
          />
          <label>Enter the desired topics</label>
          <p>Space topics with a comma (e.g microbiology,physiology,psycology e.t.c)</p>
          <input
            type="text"
            value={targetForm.topics}
            onChange={(e) => setTargetForm(prev => ({ ...prev, topics: e.target.value }))}
          />
          <button type="submit" className="btn-primary">Save Target</button>
        </form>
      }
    </div>
  )
}

export default Study_Modal