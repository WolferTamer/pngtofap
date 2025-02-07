import { useState } from 'react'
import './App.css'
import Dropdown from './Dropdown'
import Slider from './Slider'

function App() {

  const [dropdown, changeDropdown] = useState('grid1')
  const handleDropdown = (value: string) => {
    changeDropdown(value)
  }
  return (
    <>
      <Dropdown callback={handleDropdown}></Dropdown>
      <Slider current={dropdown}></Slider>
    </>
  )
}

export default App
