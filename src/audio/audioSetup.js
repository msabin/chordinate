import { useRef } from "react";

const A4 = 440;
const MIDI_A4 = 69;

const ATTACK = .1;
const RELEASE = 4;
const WAVEFORM = 'triangle'

class Oscillators {

  // Create an audio context for oscillators and a stack of oscillators
  constructor() {
    this.context = new AudioContext();

    this.oscillators = {};

    this.currentVol = .25;
    this.vol = this.context.createGain();
    this.vol.gain.setValueAtTime(this.currentVol, this.context.currentTime);

    this.vol.connect(this.context.destination);
  }

  setVol(vol) {
    this.currentVol = Math.min(Math.max(vol, 0), 1);
    this.vol.gain.exponentialRampToValueAtTime(this.currentVol, this.context.currentTime + .25);
    
    // setValueAtTime(this.currentVol, this.context.currentTime);;
  }


  playNote(midiNote) {
    const distFromA4 = midiNote - MIDI_A4;
    const Hz = 2 ** ((1 / 12) * distFromA4) * A4;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.frequency.setValueAtTime(Hz, this.context.currentTime);
    osc.type = WAVEFORM;
    gain.gain.setValueAtTime(0, this.context.currentTime);

    osc.connect(gain);
    gain.connect(this.vol);

    // Start the attack of the note and the note's oscillator
    gain.gain.exponentialRampToValueAtTime(1.0, this.context.currentTime + ATTACK);
    osc.start();

    // Remember the oscillator and gain node to turn them off later
    this.oscillators[midiNote] = [osc, gain];
  }

  stopNote(midiNote) {
    const [osc, gain] = this.oscillators[midiNote];

    // exponentialRampToValueAtTime doesn't accept 0, require positive number
    gain.gain.exponentialRampToValueAtTime(.00000001, this.context.currentTime + RELEASE);
    setTimeout(() => { osc.stop(); gain.disconnect(); }, RELEASE * 1000);

    delete this.oscillators[midiNote];
  }
}

export function useOscillators() {
  const oscRef = useRef();
  if (!oscRef.current) {
    oscRef.current = new Oscillators();
  }
  return oscRef.current;
}
