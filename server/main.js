exports.main = (io) => {
    const players = [] // player list
    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', (login, password) => {
            console.log(`Login=${login}\nPassowrd=${password}`);
	    players.push(login);
	    io.sockets.emit('update-players', players); // emit to all sockets
        });

	socket.on('player-left', (login) => {
	    // TODO delete login from players
	    io.sockets.emit('update-players', players); // emit to all sockets
	});
    });
}
