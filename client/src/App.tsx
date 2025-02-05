import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Slider from './Slider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Slider></Slider>
    </>
  )
}

export default App
