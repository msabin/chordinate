import { Key } from "../Key/Key"
import { useEffect } from 'react'
import { midiSetup } from '/src/utils/midiSetup'
import { useOscillators } from "/src/utils/audioSetup";
import { useSocket } from "/src/utils/socketSetup";
import styles from "./index.module.css";

export function KeyBoard(){
  const oscillators = useOscillators();
  const socket = useSocket();

  useEffect(() => {
    midiSetup(handlePressKey, handleReleaseKey, socket);

    function handlePressKey(midiNote, velocity) {
      const key = document.getElementById(midiNote)
      key.ariaPressed = 'true';

      oscillators.playNote(midiNote, velocity);
    }

    function handleReleaseKey(midiNote) {
      const key = document.getElementById(midiNote)
      key.ariaPressed = 'false';

      oscillators.stopNote(midiNote);
    }

    const KEYBOARD = ['a', 'w', 's', 'e', 'd', 'f', 
        't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 
        'p', ';']
    const KEY_VELOCTIY = .5;

    const root = document.documentElement;
    const ourHue = root.style.getPropertyValue('--pressed-key-hue');

    function handleKeyDown(e) {
      switch (e.key) {
        case '1':
          oscillators.setWaveForm("sine");
          return;
        case '2':
          oscillators.setWaveForm("triangle");
          return;
        case '3':
          oscillators.setWaveForm("square");
          return;
        case '4':
          oscillators.setWaveForm("sawtooth");
          return;
      }

      if ( e.repeat ) return;

      const midiNote = KEYBOARD.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        socket.emit('midi press', midiNote, KEY_VELOCTIY, ourHue);
        handlePressKey(midiNote, KEY_VELOCTIY);
      }
    }

    function handleKeyUp(e) {

      const midiNote = KEYBOARD.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        socket.emit('midi release', midiNote, ourHue);
        handleReleaseKey(midiNote);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    socket.on('midi press', (midi, velocity, hue) => {
      const key = document.getElementById(midi);

      // If no one else is pressing the key, then we just press it 
      // ourselves normally
      if ( key.ariaPressed === 'false') {

        handlePressKey(midi, velocity);

      }
      // Otherwise, we leave it pressed and adjust the hue according to 
      // the hue of the other user
      else {
        const currentHue = key.style.getPropertyValue('--current-hue');

        key.style.setProperty('--current-hue', (currentHue + hue)/2);
      }
    })

    socket.on('midi release', (midi, hue) => {
      const key = document.getElementById(midi);
      const currentHue = key.getPropertyValue('--current-hue');

      const newHue = currentHue*2 - hue;
      key.style.setProperty('--current-hue', newHue);

      // If removing someone else's key press leaves us with our own hue,
      // 
      if ( newHue === ourHue && key.ariaPressed === 'false') {
        handleReleaseKey(midi);
      }
      
      
    })

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