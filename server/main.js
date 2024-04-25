const {Mongo} = require('./db/mongo');
const settings = require('../serverConfig.json');
const mongo = new Mongo(settings.mongoUri);
const {User} = require('./db/user');
const bcrypt = require("bcrypt");
const lobby = require('./lobby');
const debugAccounts = require("./debug").DebugAccounts;


exports.main = (io) => {
    lobby.setIo(io);

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', async (login, password) => {

        if (debugAccounts.isDebug(login, password)) {
            console.log("debug");
            socket.emit('login-submit-answer', true);
            console.log(`Logged: ${login} | ${password}`);
            lobby.addUser(socket, new User(socket.id, login))
        } else {
            const saltRounds = 10;
            const hashedPassword = bcrypt // hashowenie hasla
                .genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(password, salt)
                })
                .catch(err => console.error(err.message));

            const result = await mongo.logInPlayer(login, hashedPassword);

            if (result != false) {
                socket.emit('login-submit-answer', true);
                console.log(`Logged: ${login} | ${hashedPassword}`);
                lobby.addUser(socket, new User(socket, result))
            } else {
                socket.emit('login-submit-answer', false);
            }
        }
        });

    socket.on('register-submit', async (login, password) => {
        const saltRounds = 10;
        const hashedPassword = bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                return bcrypt.hash(password, salt)
            })
            .catch(err => console.error(err.message));
        if (login == "debug" && password == "debug") {
            const result = true;
            socket.emit('register-submit-answer', result);
        } else {
            const result = await mongo.signInPlayer(login, hashedPassword);
            socket.emit('register-submit-answer', result);
            if (result) {
                console.log(`Registered: ${login} | ${password}`);
            }
        }
    });
    });
}
