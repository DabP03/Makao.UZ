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

    let game = null;
    let player = null;
    // tmp start
    createGame();
    joinGame(0);
    // tmp stop

    function removeUser() {
        socket.leave('lobby');
        users.splice(users.indexOf(user), 1); // remove player from list
        io.to('lobby').emit('update-players', users) // emit to all sockets
        socket.off('lobby-exit', removeUser);
        console.log(`Users in lobby: ${users.map(obj => obj["login"])}`);
    }
    socket.on('lobby-exit', removeUser);
    socket.on('disconnect', removeUser);


    function createGame(name) {
        games.push(new Makao());
        console.log("Game created");
    }

    function joinGame(index) {
        game = games[index];
        game.addPlayer(user);
        socket.leave("lobby");
        socket.join(game.id);
        socket.on('game-start', startGame);
        console.log("User " + user.login + " joined game " + game.id);
    }

    function startGame() {
        game.start();
        player = game.getPlayer(user);
        io.to(game.id).emit('game-update', game.getState(player));
        console.log("Game " + game.id + " started");
        socket.on("game-action", performGameAction);
    }

    function performGameAction(action, arg) {
        if (game.action(player, action, arg)) {
            io.to(game.id).emit('game-update', game.getState(player));
        }
    }

    // function leaveGame() {

    // }
}
