const {User} = require("./db/user");
const lobby = require("./lobby");

class DebugAccounts {
    constructor() {
        this.accounts = [
            ["debug1", "debug1"],
            ["debug2", "debug2"],
            ["debug3", "debug3"],
            ["debug4", "debug4"],
            ["asdf", "asdf"],
            ["qwer", "qwer"],
            ["zxcv", "zxcv"],
        ];
    }

    isDebug(login, password) { // checks if login and password is in DebugAccounts.accounts
        for (let i = 0; i < this.accounts.length; i++) {
            if (login == this.accounts[i][0] && password == this.accounts[i][1]) {
                console.log(true);
                return true;
            }
        }
        return false;
    }
}

module.exports =  {
    DebugAccounts: new DebugAccounts(),
}
