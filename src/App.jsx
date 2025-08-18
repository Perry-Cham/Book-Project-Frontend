import { useState } from 'react'
import LandingPage from './routes/landing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<LandingPage />
    </>
  )
}

export default App
