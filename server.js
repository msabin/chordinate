import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'dist/index.html'));
});

app.use(express.static(join(__dirname, 'dist')));

let numSockets = 0;
const freeSockets = []

io.on('connection', (socket) => {
  let socketNum;
  if ( freeSockets.length >= 1 ) {
    socketNum = freeSockets.pop();
  }
  else {
    numSockets++;
    socketNum = numSockets;
  }

  socket.emit('number assignment', socketNum);
  console.log('User connected.  Assigned number: ' + socketNum);

  socket.on('midi press', (midi, velocity) => {
    console.log('MIDI: ' + midi + " " + velocity);

    socket.broadcast.emit('midi press', midi, velocity, socketNum);
  });

  socket.on('midi release', (midi) => {
    console.log('MIDI RELEASE:' + midi);

    socket.broadcast.emit('midi release', midi, socketNum);
  })

  socket.on('disconnect', () => {
    console.log('Socket' + socketNum + ' disconnected');
    freeSockets.push(socketNum);
  });
});

// Turn on Node.js's event loop for the server to listen for requests
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});