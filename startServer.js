const settings = require('./serverConfig.json');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: settings.corsAll,
    }
});
const port = process.env.PORT || settings.port;


require('./server/main').main(io);

server.listen(port, () => {
    console.log(`Socket.IO server is listening on port ${port}`);
});

