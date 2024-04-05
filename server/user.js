exports.User = class User {
    constructor(login) {
        this.login = login;
        this.wins = 0;
        this.loses = 0;
    }

    incrementWins() {
        this.wins++;
    }

    incrementLoses() {
        this.loses++;
    }
}
