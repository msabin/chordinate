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

    function handlePressKey(midiNote, velocity, hue) {
      const key = document.getElementById(midiNote)

      // If key is already pressed, just mix in the new hue
      if ( key.ariaPressed === 'true') {
        const currentHue = key.style.getPropertyValue('--current-hue');
        
        key.style.setProperty('--current-hue', (currentHue + hue)/2);
        console.log("averaging hues " + currentHue + " and " + hue);
      }
      // Otherwise, set it to the incoming hue and play the key
      else {
        key.style.setProperty('--current-hue', hue);
        key.ariaPressed = 'true';
        console.log("setting hue to " + hue);
        oscillators.playNote(midiNote, velocity);
      }
    }

    function handleReleaseKey(midiNote, hue) {
      const key = document.getElementById(midiNote);
      
      const currentHue = key.style.getPropertyValue('--current-hue');

      console.log("Release - current hue: " + currentHue + " removing hue: " + hue);
      console.log(hue === currentHue);
      let newHue;
      if ( Number(currentHue) === Number(hue)) {
        newHue = 0;
        key.ariaPressed = 'false';
        oscillators.stopNote(midiNote);

        console.log("releasing note");
      }
      else {      
        newHue = currentHue * 2 - hue;
        console.log("removing hue " + hue + " from " + currentHue);
      }

      key.style.setProperty('--current-hue', newHue);
    }

    const KEYBOARD = ['a', 'w', 's', 'e', 'd', 'f', 
        't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 
        'p', ';']
    const KEY_VELOCTIY = .5;


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
        socket.emit('midi press', midiNote, KEY_VELOCTIY, socket.hue);
        handlePressKey(midiNote, KEY_VELOCTIY, socket.hue);
      }
    }

    function handleKeyUp(e) {

      const midiNote = KEYBOARD.indexOf(e.key.toLowerCase()) + 60
      if (midiNote !== 59) {
        socket.emit('midi release', midiNote, socket.hue);
        handleReleaseKey(midiNote, socket.hue);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    socket.on('midi press', (midi, velocity, hue) => {
      handlePressKey(midi, velocity, hue);
    })

    socket.on('midi release', (midi, hue) => {
        handleReleaseKey(midi, hue);
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