const {Game} = require("./game");
const game = new Game();

function generatePlayersInLobby(arr) {
    let players = "";
    for (let i = 0; i < arr.length; i++) {
        players += `<li>${arr[i]}</li>`;
    }
    return players;
}

exports.main = (io) => {
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);

        socket.once("login", (name) => {
            if (game.running) {
                socket.emit("info", "game already started");
                return;
            }
            socket.join("lobby");
            socket.emit("changeDivLobby");
            socket.name = name;
            console.log(`${socket.name} logged in`);
            game.addPlayer(socket);
            socket.emit('lobbyPlayers', generatePlayersInLobby(game.playersInfo));
        });
        socket.on('login', () => {
            if (!game.running) {
                socket.to("lobby").emit('lobbyPlayers', generatePlayersInLobby(game.playersInfo));
            }
        });
        socket.on('disconnect', (reason) => {
            game.removePlayer(socket.id);
            socket.to("lobby").emit('lobbyPlayers', generatePlayersInLobby(game.playersInfo));
            io.to("game").emit("playersUpdated", game.playersInfo);
            console.log(`user ${socket.id} disconnected`);
        });
    });
}