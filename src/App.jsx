import './App.css'
import { useEffect } from 'react'
import { KeyBoard } from './components/KeyBoard/KeyBoard'
import { midiSetup } from './audio/midiSetup'

function App() {

  useEffect(() => {
    midiSetup();
  }, [])

  return (
    <>
      <KeyBoard></KeyBoard>
    </>
  )
}

export default App
