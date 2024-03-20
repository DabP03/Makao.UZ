const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer();
const io = new Server(server);
const port = process.env.PORT || 3000;

require('./server/main').main(io);

server.listen(port, () => {
    console.log(`Socket.IO server is listening on port ${port}`);
});

