const {Games} = require("./games");

class User {
    constructor(socketID, user) {
        this.socket = socketID;
        this.currentGame = null;

        if (user.games != undefined) {
            this.login = user.login;
            this.games = user.games;
        } else {
            this.login = user;
            this.games = new Games();
        }
    }

    incrementWins() {
        this.currentGame.wins++;
    }

    incrementLoses() {
        this.currentGame.loses++
    }
}

class UserData {
    constructor(user) {
        if (user.games != undefined) {
            this.login = user.login;
            this.games = user.games;
        } else {
            this.login = user;
            this.games = new Games();
        }
    }
}

module.exports = {
    User: User,
    UserData: UserData,
}
