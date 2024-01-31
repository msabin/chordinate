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
      const key = document.getElementById(midiNote);
      hue = Number(hue);

      // If key is already pressed, just mix in the new hue
      if ( key.ariaPressed === 'true') {
        const currentHue = Number(key.style.getPropertyValue('--current-hue'));
        const componentHues = key.style.getPropertyValue('--component-hues');
        
        key.style.setProperty('--current-hue', (currentHue + hue)/2);
        key.style.setProperty('--component-hues', componentHues + "," + hue);
        console.log("averaging hues " + currentHue + " and " + hue);
      }
      // Otherwise, set it to the incoming hue and play the key
      else {
        key.style.setProperty('--current-hue', hue);
        key.style.setProperty('--component-hues', hue);
        key.ariaPressed = 'true';
        console.log("setting hue to " + hue);
        oscillators.playNote(midiNote, velocity);
      }
    }

    function handleReleaseKey(midiNote, hue) {
      const key = document.getElementById(midiNote);

      hue = Number(hue);
      const componentHuesString =  key.style.getPropertyValue('--component-hues');
      const componentHues = componentHuesString.split(',').map(Number);

      // If this is the last hue that was pressing the key, we can remove that hue
      // and release the key.
      if ( componentHues.length === 1 ) {
        key.style.setProperty('--current-hue', 0);
        key.style.setProperty('--component-hues', '');

        key.ariaPressed = 'false';
        oscillators.stopNote(midiNote);

        console.log("releasing note");
      }
      // Otherwise, the key is still being held down and we simply adjust its hue.
      else {
        // Remove the hue
        componentHues.splice(componentHues.indexOf(hue), 1);
        key.style.setProperty('--component-hues', componentHues.join());

        // Mix all the hues together one-by-one
        const newHue = componentHues.reduce((accumulator, hue) => 
          (accumulator + hue)/2);
        key.style.setProperty('--current-hue', newHue);
      }
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