import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import LoginRegister from '../Pages/LogiRegister'
import AdminDashboard from '../Pages/AdminDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LoginRegister />
    {/* <AdminDashboard /> */}
    </>
  )
}

export default App
