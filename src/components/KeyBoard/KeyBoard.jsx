import { Key } from "../Key/Key"
import { useEffect } from 'react'
import { midiSetup } from '/src/audio/midiSetup'
import { useOscillators } from "/src/audio/audioSetup";
import styles from "./index.module.css";

export function KeyBoard(){
  const oscillators = useOscillators();

  useEffect(() => {
    midiSetup(handlePressKey, handleReleaseKey);

    function handlePressKey(midiNote) {
      const key = document.getElementById(midiNote)
      key.ariaPressed = 'true';

      oscillators.playNote(midiNote);
    }

    function handleReleaseKey(midiNote) {
      const key = document.getElementById(midiNote)
      key.ariaPressed = 'false';

      oscillators.stopNote(midiNote);
    }

    const keyboard = ['a', 'w', 's', 'e', 'd', 'f', 
        't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 
        'p', ';']

    function handleKeyDown(e) {
      if ( e.repeat ) return;

      const midiNote = keyboard.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        handlePressKey(midiNote);
      }
    }

    function handleKeyUp(e) {

      const midiNote = keyboard.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        handleReleaseKey(midiNote);
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
    <div id={styles.keyboard}>
      {[...Array(88).keys()].map(i => 
        <Key 
          midiNote={i+21}
          key={i+21}
        ></Key>)}
    </div>
  )
}