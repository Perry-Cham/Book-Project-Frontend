import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navigation_Bar from './routes/components/navbar'
import LandingPage from './routes/landing'
import './css/styles.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navigation_Bar />
<LandingPage />
<Routes>
  <Route path='/home' element={<Home />}/>
  <Route path='/goal' element={<Goals />}/>
  <Route path='/study' element={<Study />}/>
</Routes>
    </Router>
  )
}

export default App
