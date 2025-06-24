import { useState } from 'react'
import './App.css'
import CVForm from './components/CVForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CVForm/>
    </>
  )
}

export default App
