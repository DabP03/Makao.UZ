const {Mongo} = require('./mongo');
const settings = require('../serverConfig.json');
const mongo = new Mongo(settings.mongoUri);
const {User} = require('./user');

exports.main = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', async (login, password) => {
            const result = await mongo.logInPlayer(login, password);
            socket.emit('answer-login-submit', new User(socket, result));
            if (result != null) {
                console.log(`Logged: ${login} | ${password}`);
            }
        });

        socket.on('register-submit', async (login, password) => {
            const result = await mongo.signInPlayer(login, password);
            socket.emit('answer-register-submit', result);
            if (result) {
                console.log(`Registered: ${login} | ${password}`);
            }
        });
    });
}
