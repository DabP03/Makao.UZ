const {Mongo} = require('./mongo');
const settings = require('../serverConfig.json');
const mongo = new Mongo(settings.mongoUri);
const {User} = require('./user');
const bcrypt = require("bcrypt");
const lobby = require('./lobby');


exports.main = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', async (login, password) => {
            const saltRounds = 10;
            const hashedPassword = bcrypt // hashowenie hasla
                .genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(password, salt)
                })
                .catch(err => console.error(err.message));
            // const hashedPassword = password;
            if (login == "debug1" && password == "debug1") {
                socket.emit('login-submit-answer', true);
                console.log("Logged debug account");
                // lobby.addUser(socket, new User(socket.id, "debug1"))

            } else if (login == "debug2" && password == "debug2") {
                socket.emit('login-submit-answer', true);
                console.log("Logged debug account");
                // lobby.addUser(socket, new User(socket.id, "debug2"))

            }  else if (login == "debug3" && password == "debug3") {
                socket.emit('login-submit-answer', true);
                console.log("Logged debug account");
                // lobby.addUser(socket, new User(socket.id, "debug3"))

            } else if (login == "debug4" && password == "debug4") {
                socket.emit('login-submit-answer', true);
                console.log("Logged debug account");
                // lobby.addUser(socket, new User(socket.id, "debug4"))

            } else if (login == "asdf" && password == "asdf") {
                socket.emit('login-submit-answer', true);
                console.log("Logged debug account");
                // lobby.addUser(socket, new User(socket.id, "asdf"))

            } else {
                const result = await mongo.logInPlayer(login, hashedPassword);
                if (result != false) {
                    socket.emit('login-submit-answer', true);
                    console.log(`Logged: ${login} | ${hashedPassword}`);
                    // lobby.addUser(socket, new User(socket, result))
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
