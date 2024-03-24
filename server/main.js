exports.main = (io) => {
    const players = [] // player list

    io.on('connection', (socket) => {
        console.log('A user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('login-submit', (login, password) => {
            console.log(`Login=${login}\nPassowrd=${password}`);
	    players.push(login); // add player to list
	    io.sockets.emit('update-players', players); // emit to all sockets
        });

	socket.on('player-left', (username) => {
	    players.splice(players.indexOf(username), 1); // remove player from list
	    io.sockets.emit('update-players', players); // emit to all sockets
	});
    });
}
