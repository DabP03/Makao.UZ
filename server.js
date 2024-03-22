const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001"
    }
});

io.on('connection', (socket) => {
    console.log('A user connected ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('login-submit', (login, password) => {
        console.log(`Login=${login}\nPassowrd=${password}`);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Socket.IO server is listening on port ${port}`);
});

