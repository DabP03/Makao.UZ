const {Mongo} = require('./db/mongo');
const settings = require('../serverConfig.json');
const mongo = new Mongo(settings.mongoUri);
const {User} = require('./db/user');
const bcrypt = require("bcrypt");
const lobby = require('./lobby');
const debugAccounts = require("./debug").DebugAccounts;



function main(io) {
    lobby.setIo(io);

    io.on('connection', (socket) => {

        function hashPassword(password) {
            const saltRounds = 10;
            const hashedPassword = bcrypt // hashowenie hasla
                .genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(password, salt)
                })
                .catch(err => console.error(err.message));
            return hashedPassword;
}

        async function loginSubmit(login, password) {
            if (debugAccounts.isDebug(login, password)) {
                console.log("debug");
                socket.emit('login-submit-answer', true);
                console.log(`Logged: ${login} | ${password}`);
                lobby.addUser(socket, new User(socket.id, login))
            } else {
                const hashedPassword = hashPassword(password);
                const result = await mongo.logInPlayer(login, hashedPassword);
                if (result != false) {
                    socket.emit('login-submit-answer', true);
                    console.log(`Logged: ${login} | ${hashedPassword}`);
                    lobby.addUser(socket, new User(socket, result))
                } else {
                    socket.emit('login-submit-answer', false);
                }
            }
        }

        async function registerSubmit(login, password) {
            if (debugAccounts.isDebug(login, password)) {
                console.log("debug");
                socket.emit('register-submit-answer', true);
                console.log(`Registered: ${login} | ${password}`);
            } else {
                const hashedPassword = hashPassword(password);
                const result = await mongo.signInPlayer(login, hashedPassword);
                socket.emit('register-submit-answer', result);
                if (result) {
                    console.log(`Registered: ${login} | ${password}`);
                }
            }

        }

        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', loginSubmit);

        socket.on('register-submit', registerSubmit);
    });
}

module.exports = {
    main: main,
}
