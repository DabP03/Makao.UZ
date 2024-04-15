const {Mongo} = require('./mongo');
const settings = require('../serverConfig.json');
const mongo = new Mongo(settings.mongoUri);
const {User} = require('./user');
const bcrypt = require("bcrypt");


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
                    // console.log('Salt: ', salt)
                    return bcrypt.hash(password, salt)
                })
                // .then(hash => {
                //     console.log('Hash: ', hash)
                // })
                .catch(err => console.error(err.message));
            // const hashedPassword = password;
            var result;
            if (login == "debug" && password == "debug") {
                socket.emit('answer-login-submit', new User(socket, "debug"));
                result = true;
            } else {
                result = await mongo.logInPlayer(login, hashedPassword);
                if (result != false) {
                    socket.emit('answer-login-submit', new User(socket.id, result));
                    console.log(`Logged: ${login} | ${hashedPassword}`);
                } else {
                    socket.emit('answer-login-submit', false);
                }
            }

        });

        socket.on('register-submit', async (login, password) => {
            const saltRounds = 10;
            const hashedPassword = bcrypt
                .genSalt(saltRounds)
                .then(salt => {
                    console.log('Salt: ', salt)
                    return bcrypt.hash(password, salt)
                })
                .then(hash => {
                    console.log('Hash: ', hash)
                })
                .catch(err => console.error(err.message));
            var result;
            if (login == "debug" && password == "debug") {
                socket.emit('answer-register-submit', result);
                result = true;
            } else {
                result = await mongo.signInPlayer(login, hashedPassword);
                socket.emit('answer-register-submit', result);
            }
            if (result) {
                console.log(`Registered: ${login} | ${password}`);
            }
        });
    });
}
