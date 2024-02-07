# chordinate (In Progress)

<img src="/screencaps/chordinate-wide.png" style="width: 100%;" alt="Image of a colorful piano keyboard as some keys are highlighted different colors.">


A communal virtual keyboard as a remote tutoring tool for piano and music theory.

**Play with the app [here](https://berry-shine-nightingale.glitch.me/)!!**

Use your computer keyboard a MIDI keyboard to play this virtual piano and anyone else on the link will see and hear what you play and can play back!

This was made for friend who got their first MIDI keyboard so that we could talk music theory over video chat!  This uses WebSockets and is likely not suitable for jam sessions due to latency, but is great as a remote tutoring and communication tool.

This project was built using the React framework for JavaScript with a Node.js backend using the Express.js framework.  It uses the [socket.io](https://socket.io/) library to create what is essentially a chat room, except, instead of text messages, it communicates MIDI data that is visualized as keys being lit up on the piano.  The Web Audio and Web MIDI APIs are used to deal with sound and connecting to MIDI controllers.


## Usage

- Plug and play with a MIDI keyboard! (Safari does not support MIDI)\
**OR**\
Use the keyboard as a piano (black keys are on QWERTY row, white keys are ASDF row):\
-WE-TYU-\
ASDFGHJK
- Distinct users visting the page will be assigned distinct colors.  The last person to press a key will get priority in color for highlighting that key.
- 1/2/3/4 keys: Switch between sine, triangle, square, and sawtooth waveforms.


## Installation
Visit [here](https://berry-shine-nightingale.glitch.me/) to play with the app in a browser immediately!

To download, explore, and modify the *source/development version* code yourself, these installation instructions should work for MacOS with the default shell:

Open a directory on your computer that you want to download this repository to and clone it from GitHub from the command line with

`git clone https://github.com/msabin/chordinate.git`

If you don't have `npm` already installed (the package manager for JavaScript libraries) that should be [done first](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  Then, in the directory that you cloned this repo to, run

`npm install`

This will install all the dependencies for the project and a new folder called `node-modules` should appear in your directory.  Then run

`npm run build`

This should use [Vite](https://vitejs.dev/guide/) to build static files for the frontend.

This app currently has the backend serving the frontend in the file `server.js`.  To serve these newly built files run

`node server.js`

This should run a local server on your machine to host the application.  The terminal should have a line that looks something like:

`server running at http://localhost:3000`

Visiting this local address on a browser (note: Safari does not support MIDI) should have a copy of the frontend being served that is connected to the WebSockets.  Opening multiple tabs/windows to this address will connect multiple users to the server that can then talk to each other by playing with the app!

## TODO

- Create buttons for selecting different waveforms
- Create knobs for Attack and Release of notes
- Allow letters, scale degrees, or both of a given musical mode to be displayed above the keys
- Create drop down menus to choose different musical modes to be displayed
- Separate the backend and frontend (maybe I just want to host the frontend on GitHub pages and have the backend set up sockets from somewhere else)
- Allow for different themes
- Probably changes hues from being assigned by the server to instead assign the user IDs and the frontend can handle calculating the hue