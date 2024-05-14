const {Game} = require('./game')

class Makao extends Game {
    start() {
        // let deck = this.shuffle(this.getDeck().concat(this.getDeck()));
        let deck = this.getDeck();
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
        this.lastMovePlayerIndex = 0;

        this.action(this.players[0], 'play-card', 0);
        console.log(this.players[0])
        console.log(this.stack)
    }

    action(player, action, arg) {
        // console.log(player.login, action, arg);

        switch (action) {

            case "play-card":
                if (arg >= player.cards.length) break;
                let card = player.cards[arg];
                let stackCard = this.stack[this.stack.length-1];
                let sameSymbols = stackCard.symbol == card.symbol;
                let sameSuits = stackCard.suit == card.suit;
                let continuing = this.lastMovePlayerIndex == player.index;
                let playerBeforePlayed = this.lastMovePlayerIndex == getIndexOfPlayerBefore(player.index);

                let canPlay = false;
                if (
                    (sameSuits && sameSymbols) ||
                    (continuing && sameSymbols) ||
                    (playerBeforePlayed && (sameSuits && sameSymbols))
                ) {
                    canPlay = true;
                }

                if (canPlay) {
                    player.cards.splice(arg, 1);
                    this.stack.push(card);
                    player.cards[arg]?.onPlay?.();
                    return true;
                }
            break;
                
            case "draw-card":
                //
            break;

            case "choose":
                //
            break;

            case "say-makao":
                //
            break;

            case "report-makao":
                //
            break;
            
        }
        return false;

        function getIndexOfPlayerBefore(index) {
            i = index - 1;
            if (i == -1) {
                i = this.players.length - 1;
            }
            return i
        }
    }

    getState(player) {
        let state = {};
        // całe karty czy nazwy?
        state.cards = player.cards;
        state.stackTop = this.stack[this.stack.length-1];
        state.others = [];
        for (let p of this.players) {
            let o = {};
            o.login = p.login;
            o.cardsQuantity = p.cards.length;
            state.others.push(o);
        }
        //info o innych(ilość kart, czyja kolej, ile stoi, makao); kolejki, do wzięcia; do wyboru;
        return state;
    }
}

module.exports = {
    Makao: Makao,
}
