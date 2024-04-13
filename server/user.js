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
    
    updateGames() {
        if (this.games == undefined) {
            this.games = new Games();
        } else {
            if (this.games.makao == undefined) {
                this.games = {
                    wins: 0,
                    loses: 0,
                };
            }
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
