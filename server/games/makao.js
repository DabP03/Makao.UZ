const {Game} = require('./game')

exports.Makao = class extends Game {
    start() {
        let deck = this.shuffle(this.getDeck());
        for(let i=0; i<this.players.length; i++) {
            this.players[i].cards = [];
            for (let j=0; j<5; j++) {
                this.players[i].cards.push(deck.pop());
            }
        }
        this.stack = [];
        this.stack.push(deck.pop());
        this.restOfCards = deck;
    }

    action(player, action, arg) {
        console.log(player.login, action, arg);

        switch (action) {

            case "play-card":
                player.cards[arg]?.onPlay?.();
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
    }

    getState(player) {
        let state = {};
        // całe karty czy nazwy?
        state.cards = player.cards;
        state.stackTop = this.stack[this.stack.length-1];
        //info o innych(ilość kart, czyja kolej, ile stoi, makao); kolejki, do wzięcia; do wyboru;
        return state;
    }
}