const {Games} = require("./games");

class User {
    constructor(socket, user) {
            this.socket = socket;
            this.currentGame = null;

        if (user instanceof UserData) {
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
        if (user instanceof User) {
        this.login = user.login;
        this.games = user.games;
        } else {
            this.login = user;
            this.games = Games();
        }
    }
}

module.exports = {
    User: User,
    UserData: UserData,
}
