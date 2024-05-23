const {Game} = require('./game')

class Makao extends Game {
    start() {
        // let deck = this.shuffle(this.getDeck().concat(this.getDeck()));
        let deck = setOnplays(this, this.getDeck());
        for(let i=0; i<this.players.length; i++) {
            this.players[i].index = i;
            this.players[i].cards = [];
            for (let j=0; j<5; j++) {
                this.players[i].cards.push(deck.pop());
            }
        }
        this.stack = [];
        // this.stack.push(deck.pop());
        this.stack.push(deck[0]);
        this.restOfCards = deck;
        this.lastMovePlayerIndex = 1;
        this.special = {name: "none", value: null}; // !!! przedyskutować !!!
        this.toChoose = null;
        this.choosingPlayerIndex = 0;

        //debug start
        // this.players[0].cards.unshift(deck[0])
        // this.action(this.players[0], 'play-card', 0);
        // this.players[0].cards.unshift(deck[0])
        // this.action(this.players[0], 'play-card', 0);
        // this.action(this.players[0], 'choose', 1);
        // this.players[1].cards.unshift(deck[2])
        // this.action(this.players[1], 'play-card', 0);
        // this.players[1].cards.unshift(deck[15])
        // this.action(this.players[1], 'play-card', 0);

        let s=[];for(let c of this.stack)s.push(c.name);console.log(s);
        //debug stop
    }

    action(player, action, arg) {
        if (this.toChoose && ((action != 'choose') || (player.index != this.choosingPlayerIndex))) {
            console.log(`Player ${this.choosingPlayerIndex} must choose`);
            return false;
        }

        switch (action) {

            case "play-card":
                if (arg >= player.cards.length) break;

                let card = player.cards[arg];
                let stackCard = this.stack[this.stack.length-1];
                let indexOfPlayerBefore = (player.index-1)>=0 ? (player.index-1) : this.players.length-1;

                let sameSymbols = stackCard.symbol == card.symbol;
                let sameSuits = stackCard.suit == card.suit;
                let continuing = this.lastMovePlayerIndex == player.index;
                let expectedToMove = this.lastMovePlayerIndex == indexOfPlayerBefore; // dostosować do 4 i K

                let canPlay = false;
                if (
                    (sameSuits && sameSymbols) ||
                    (continuing && sameSymbols)
                ) {
                    canPlay = true;
                }
                
                if (expectedToMove) {
                    switch (this.special.name) {
                        case "suit-change":
                            if (this.special.value == card.suit) canPlay = true;
                        break;
                        default:
                            if (sameSuits || sameSymbols) canPlay = true;
                    }
                }

                if (canPlay) {
                    player.cards.splice(arg, 1);
                    this.stack.push(card);
                    this.lastMovePlayerIndex = player.index;
                    this.special = {name: "none", value: null}; //??
                    card?.onPlay?.(this);
                    console.log(`${player.login} played ${card.name}`)
                    return true;
                } else {
                    console.log(`${player.login} can't play ${card.name}`)
                }
            break;
                
            case "draw-card":
                //
            break;

            case "choose":
                let choice = this.toChoose[arg];
                if (choice) {
                    this.special.name = "suit-change";
                    this.special.value = choice;
                    this.toChoose = null;
                }
                console.log("choosing " + choice)
            break;

            case "say-makao":
                //
            break;

            case "report-makao":
                //
            break;
            
        }
        return false;
    }

    getState(player) {
        let state = {};
        state.cards = player.cards;
        state.stackTop = this.stack[this.stack.length-1];
        state.others = [];
        for (let p of this.players) {
            let o = {};
            o.login = p.login;
            o.cardsQuantity = p.cards.length;
            state.others.push(o);
        }
        state.toChoose = (player.index == this.choosingPlayerIndex) ? this.toChoose : null;
        state.special = this.special;
        return state;
    }
}

function setOnplays(game, deck) {
    for (let i=0; i<deck.length; i++) {
        let card = deck[i];
        switch (card.symbol) {
            case 'A':
                card.onPlay = (game) => {
                    game.choosingPlayerIndex = game.lastMovePlayerIndex;
                    game.toChoose = ['♥', '♣', '♦', '♠'];
                }
            break;
        }
    }
    return deck;
}

module.exports = {
    Makao: Makao,
}
