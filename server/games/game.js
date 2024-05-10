class Game {
    constructor() {
        this.id = getId();
        this.table = {};
        this.players = [];
        this.getDeck = getPockerDeck;
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
        this.players.push(user);
    }
    removePlayer(user) {
        this.players.splice(this.players.indexOf(user), 1);
    }
    getPlayer(user) {
        console.log(user)
        for (let p of this.players) {
            if (p.socket = user.socket) return p;
        }
        return null;
    }
    getState(player) {}
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
        deck.push(new Card('D' + suit));
        deck.push(new Card('K' + suit));
    }
    return deck;
}

class Card {
    constructor(name) {
        this.name = name;
    }
    get symbol() {
        return this.name.slice(0, -1);
    }
    get suit() {
        return this.name.slice(-1);
    }
    get filename() {
        const fileSuits = [
            ["♥", "Hearts"],
            ["♣", "Clubs"],
            ["♦", "Diamonds"],
            ["♠", "Spades"],
        ];
        let correctSuit;
        for (let suitPair of fileSuits) {
            if (this.suit == suitPair[0]) {
                correctSuit = suitPair[1];
            }
        }
        return this.symbol + correctSuit + ".png";
    }
}

module.exports = {
    Game: Game,
}
