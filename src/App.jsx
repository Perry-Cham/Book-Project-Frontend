import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navigation_Bar from './routes/components/navbar'
import LandingPage from './routes/landing'
import Download_Page from './routes/download'
import Auth from './routes/auth'
import Home from './routes/home'
import './css/styles.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navigation_Bar />
<Routes>
<Route path="/"  element={<LandingPage />}/>
  <Route path='/home' element={<Home />}/>
  <Route path='/download/:id' element={<Download_Page />}/>
  <Route path='/signin' element={<Auth type="login"/>}/>
  <Route path='/signup' element={<Auth type="signup"/>}/>
</Routes>
    </Router>
  )
}

export default App
