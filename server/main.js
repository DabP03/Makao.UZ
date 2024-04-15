const {Mongo} = require('./mongo');
const mongo = new Mongo();
const lobby = require('./lobby');

exports.main = (io) => {
    lobby.setIo(io);

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', async (login, password) => {
            console.log(`Submited login: ${login} | ${password}`);
            const result = await mongo.logInPlayer(login, password);
            socket.emit('login-submit-answer', result);
            if (result) {
                console.log(`Logged: ${login} | ${password}`);
                lobby.addUser(socket, login);
            }
        });

        socket.on('register-submit', async (login, password) => {
            console.log(`Submited register: ${login} | ${password}`);
            const result = await mongo.signInPlayer(login, password);
            socket.emit('register-submit-answer', result);
            console.log(result);
            if (result) {
                console.log(`Registered: ${login} | ${password}`);
            }
        });
    });
}
