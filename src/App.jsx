import './App.css'
import { useEffect } from 'react'
import { KeyBoard } from './components/KeyBoard/KeyBoard'
import { midiSetup } from './audio/midiSetup'

function App() {

  useEffect(() => {
    midiSetup();

    const keyboard = ['a', 'w', 's', 'e', 'd', 'f', 
        't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 
        'p', ';']

    function handleKeyDown(e) {

      const midiNote = keyboard.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        const key = document.getElementById(midiNote)
        key.ariaPressed = 'true';
      }
    }

    function handleKeyUp(e) {

      const midiNote = keyboard.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        const key = document.getElementById(midiNote)
        key.ariaPressed = 'false';
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleKeyUp);
    }
  }, [])

  return (
    <>
      <KeyBoard></KeyBoard>
    </>
  )
}

export default App
