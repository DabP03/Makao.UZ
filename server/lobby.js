let users = [];
let games = [];
let io;
let {Makao} = require('./games/games');

// exports.setIo = (newio) => {
function setIo(newio) {
    io = newio;
}

// tmp start
// games.push(new Makao());
// let g = getGame(0);
// g.addPlayer({login:"typ1"})
// g.addPlayer({login:"typ2"})
// g.addPlayer({login:"typ3"})
// if(g.canStart()) g.start()
// tmp stop

// exports.addUser = (socket, user) => {
function addUser(socket, user) {
    users.push(user);
    socket.join('lobby');
    io.to('lobby').emit('lobby-update', users, getRoomList());
    console.log(`Users in lobby: ${users.map(obj => obj["login"])}`);

    let game = null;
    let player = null;

    function removeUser() {
        socket.leave('lobby');
        users.splice(users.indexOf(user), 1); // remove player from list
        io.to('lobby').emit('lobby-update', users, getRoomList());
        socket.off('lobby-exit', removeUser);
        socket.off('game-join', joinGame);
        console.log(`Users in lobby: ${users.map(obj => obj["login"])}`);
    }
    socket.on('lobby-exit', removeUser);
    socket.on('disconnect', removeUser);
    socket.on('game-join', joinGame);


    // function createGame(name) {
    //     games.push(new Makao())
    // }

    function joinGame(id) {

        game = getGame(id);
        if (game) {
            game.addPlayer(user);
            removeUser();

            socket.join(game.id);
            socket.emit('game-join-answer', true);
            io.to(game.id).emit('game-room-update', game.players);
            console.log("User " + user.login + " joined game " + game.id);

            socket.on('game-start', startGame);
            socket.on('disconnect', () => {
                game.removePlayer(player);
                io.to(game.id).emit('game-room-update', game.players);
            });
    
            function startGame() {
                if (game.canStart()) {
                    game.start();
                    player = game.getPlayer(user);
                    io.to(game.id).emit('game-start', game.getState(player));
                    io.to(game.id).emit('game-start', game.getState(player));
                    console.log("Game " + game.id + " started");
                    socket.on("game-action", performGameAction);
        
                    function performGameAction(action, arg) {
                        if (game.action(player, action, arg)) {
                            io.to(game.id).emit('game-update', game.getState(player));
                        }
                    }
                }
            }

        } else {
            console.log(`Not game with id ${id}`);
            socket.emit('game-join-answer', false);
        }


    }

    // function leaveGame() {

    // }
}

function getRoomList() {
    roomList = [];
    for (let g of games) {
        let room = {};
        room.name = g.constructor.name;
        room.id = g.id;
        roomList.push(room);
    }
    return roomList;
}

function getGame(id) {
    let game = null;
    for (let g of games) {
        if (g.id == id) {
            game = g;
            break;
        }
    }
    return game;
}

module.exports = {
    setIo: setIo,
    addUser: addUser,
}
