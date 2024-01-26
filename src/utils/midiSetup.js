const MIDI_PRESS = parseInt("90", 16);
const MIDI_RELEASE = parseInt("80", 16);
const MAX_VELOCITY = 127;

let midi = null;
let pressKey, releaseKey;

export function midiSetup(onPressKey, onReleaseKey) {
  try {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } catch {
    alert(
      "This browser doesn't support MIDI.  If you would like to use a MIDI keyboard with this app, please use a different browser like Firefox or Chrome."
    );
  }
  pressKey = onPressKey;
  releaseKey = onReleaseKey;
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
    str += character.toString(10) + ' ';
  }
  console.log(str);

  if (event.data[0] === MIDI_PRESS) {
    console.log(event.data[2] / MAX_VELOCITY);
    pressKey(event.data[1], event.data[2] / MAX_VELOCITY);
  }
  else if (event.data[0] === MIDI_RELEASE) {
    releaseKey(event.data[1]);
  }
}
