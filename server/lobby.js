let users = [];

exports.addUser = (socket, login) => {
    users.push(login);
    socket.join('lobby');
    socket.emit('update-players', users); // emit to all sockets
    socket.to('lobby').emit('update-players', users)
    console.log(`Users in lobby: ${users}`);

    function removeUser() {
        socket.leave('lobby');
        users.splice(users.indexOf(login), 1); // remove player from list
        socket.to('lobby').emit('update-players', users) // emit to all sockets
        socket.off('lobby-exit', removeUser);
        console.log(`Users in lobby: ${users}`);
    }
    socket.on('lobby-exit', removeUser);
    socket.on('disconnect', removeUser);
}