class Game {
    constructor() {
        this.id = getId();
        this.started = false;
        this.ended = false;
        this.table = {};
        this.players = [];
        this.getDeck = getPockerDeck;
        this.minPlayers = 2;
        this.maxPlayers = Infinity;
    }
    shuffle(table) {
        let shuffled = [];
        let r;
        while(table.length > 0) {
            r = Math.floor(Math.random() * table.length);
            shuffled.push(table[r]);
            table.splice(r,1);
        }
        return shuffled;
    }
    addPlayer(user) {
        if (!this.started) {
            this.players.push(user);
            user.index = this.players.length-1;
            return true;
        } else {
            return false;
        }
    }
    removePlayer(user) {
        this.players.splice(this.players.indexOf(user), 1);
        for (let i=0; i<this.players.length; i++) {
            this.players[i].index = i;
        }
        this.onRemovePlayer(user);
    }
    onRemovePlayer(user) {}
    getPlayer(user) {
        for (let p of this.players) {
            if (p.socket == user.socket) return p;
        }
        return null;
    }
    canStart() {
        let n = this.players.length;
        return (n >= this.minPlayers && n <= this.maxPlayers);
    }
    getState(player) {}
    sendState(io, event) {
        for (let p of this.players) {
            io.to(p.socket).emit(event, this.getState(p));
        }
    }
    start() {}
    action() {}
};

const getId = (()=>{
    let id = 0;
    return () => {
        return id++;
    }
})();

function shuffle(table) {
    let shuffled = [];
    while(table.length > 0) {
        r = Math.floor(Math.random() * table.length);
        shuffled.push(table[r]);
        table.splice(r,1);
    }
}

function getPockerDeck() {
    const suits = ['♥', '♣', '♦', '♠'];
    let deck = [];
    for (let suit of suits) {
        deck.push(new Card('A' + suit));
        for (let i=2; i<=10; i++) {
            deck.push(new Card(i + suit));
        }
        deck.push(new Card('J' + suit));
        deck.push(new Card('Q' + suit));
        deck.push(new Card('K' + suit));
    }
    return deck;
}

class Card {
    constructor(name) {
        this.name = name;
        this.filename = (() => {
            const fileSuits = [
                ["♥", "Hearts"],
                ["♣", "Clubs"],
                ["♦", "Diamonds"],
                ["♠", "Spades"],
            ];
            for (let suitPair of fileSuits) {
                if (this.suit == suitPair[0]) {
                    return this.symbol.toLowerCase() + suitPair[1] + ".png";
                }
            }
        })();
    }
    get symbol() {
        return this.name.slice(0, -1);
    }
    get suit() {
        return this.name.slice(-1);
    }
    // get filename() {
    //     return (() => {
    //         const fileSuits = [
    //             ["♥", "Hearts"],
    //             ["♣", "Clubs"],
    //             ["♦", "Diamonds"],
    //             ["♠", "Spades"],
    //         ];
    //         for (let suitPair of fileSuits) {
    //             if (this.suit == suitPair[0]) {
    //                 return this.symbol.toLowerCase() + suitPair[1] + ".png";
    //             }
    //         }
    //     })();
    // }
}

module.exports = {
    Game: Game,
}
