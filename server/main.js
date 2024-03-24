const {Mongo} = require('./mongo');
const mongo = new Mongo();

exports.main = (io) => {
    const players = []; // player list

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', async (login, password) => {
            console.log(`Submited login: ${login} | ${password}`);
            const result = await mongo.logInPlayer(login, password);
            socket.emit('answer-login-submit', result);
            if (result) {
                console.log(`Logged: ${login} | ${password}`);
                players.push(login); // add player to list
                io.sockets.emit('update-players', players); // emit to all sockets
            }
        });

        socket.on('register-submit', async (login, password) => {
            console.log(`Submited register: ${login} | ${password}`);
            const result = await mongo.signInPlayer(login, password);
            socket.emit('answer-register-submit', result);
            console.log(result);
            if (result) {
                console.log(`Registered: ${login} | ${password}`);
            }
        });

        socket.on('player-left', (username) => {
            players.splice(players.indexOf(username), 1); // remove player from list
            io.sockets.emit('update-players', players); // emit to all sockets
        });
    });
}
