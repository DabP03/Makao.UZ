let users = [];
let userLogins = [];
let io;

exports.setIo = (newio) => {
    io = newio;
    console.log(io);
}

exports.addUser = (socket, user) => {
    users.push(user);
    userLogins.push(user.login);
    socket.join('lobby');
    io.to('lobby').emit('update-players', userLogins);
    console.log(`Users in lobby: ${userLogins}`);

    function removeUser() {
        socket.leave('lobby');
        users.splice(users.indexOf(user), 1); // remove player from list
        userLogins.splice(userLogins.indexOf(userLogins), 1); // remove player from list
        io.to('lobby').emit('update-players', userLogins) // emit to all sockets
        socket.off('lobby-exit', removeUser);
        console.log(`Users in lobby: ${userLogins}`);
    }
    socket.on('lobby-exit', removeUser);
    socket.on('disconnect', removeUser);
}
