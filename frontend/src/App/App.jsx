import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import LoginRegister from '../Pages/LogiRegister'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LoginRegister />
    </>
  )
}

export default App
