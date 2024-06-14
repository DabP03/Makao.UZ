const settings = require('./serverConfig.json');
const http = require('http');
// const express = require('express');
const { Server } = require('socket.io');
// const app = express();
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: settings.corsAll,
        methods: ['GET', 'POST'],
    },
});

// // Serve the static files from the Vite build
// app.use(express.static('.'));

// // Handle all other routes with the index.html from Vite build
// app.get('*', (req, res) => {
//   res.sendFile('./index.html');
// });

const port = settings.port;


require('./server/main').main(io);

server.listen(port, () => {
    console.log(`Socket.IO server is listening on port ${port}`);
});

