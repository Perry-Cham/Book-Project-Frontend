import { useState } from 'react'
import Navigation_Bar from './routes/components/navbar'
import LandingPage from './routes/landing'
import './css/styles.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation_Bar />
<LandingPage />
    </>
  )
}

export default App
