exports.Game = class Game {
    constructor() {
        this.players = [];
        this.running = false;
    }

    start() {
        this.running = true;
    }

    end() {
        this.running = false;
        this.players = [];
    }

    addPlayer(socket) {
        if (!this.running) {
            this.players.push(socket);
        }
    }
    
    get playersInfo() {
        const names = [];
        for (let player of this.players) {
            names.push(player.name);
        }
        return names;
    }

    removePlayer(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) {
                this.players.splice(i, 1);
            }
        }
    }
}