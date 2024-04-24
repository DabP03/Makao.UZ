let users = [];
let games = [];
let io;
let {Makao} = require('./games/games');

exports.setIo = (newio) => {
    io = newio;
}

exports.addUser = (socket, user) => {
    users.push(user);
    socket.join('lobby');
    io.to('lobby').emit('update-players', users);
    console.log(`Users in lobby: ${users.map(obj => obj["login"])}`);

    function removeUser() {
        socket.leave('lobby');
        users.splice(users.indexOf(user), 1); // remove player from list
        io.to('lobby').emit('update-players', users) // emit to all sockets
        socket.off('lobby-exit', removeUser);
        console.log(`Users in lobby: ${users.map(obj => obj["login"])}`);
    }
    socket.on('lobby-exit', removeUser);
    socket.on('disconnect', removeUser);


    // function createGame(name) {
    //     games.push(new Makao())
    // }

    // function joinGame(index) {
        
    // }

    // function leaveGame() {

    // }
}
