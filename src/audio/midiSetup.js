const MIDI_PRESS = parseInt("90", 16);
const MIDI_RELEASE = parseInt("80", 16);

let midi = null;

export function midiSetup() {
  try {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } catch {
    alert(
      "This browser doesn't support MIDI.  If you would like to use a MIDI keyboard with this app, please use a different browser like Firefox or Chrome."
    );
  }
}

function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  midi = midiAccess;
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midi);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
  }
}

function startLoggingMIDIInput(midiAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function onMIDIMessage(event) {
  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  console.log(str);
  console.log('MIDI note:', event.data[1]);

  const key = document.getElementById(event.data[1]);

  if (event.data[0] === MIDI_PRESS) {
    
    key.ariaPressed = 'true';

    // Change the styling of the key corresponding to MIDI the note event.data[1]
  }
  else if (event.data[0] === MIDI_RELEASE) {
    key.ariaPressed = 'false';
  }
}
