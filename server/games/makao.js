const {Game} = require('./game')

class Makao extends Game {
    start() {
        if (this.started) {
            console.log(`game ${this.id} already started`);
            return false;
        }
        let deck = this.getDeck().concat(this.getDeck());
        deck = setOnplays(this, deck);
        // deck = this.shuffle(deck);
        for(let i=0; i<this.players.length; i++) {
            this.players[i].index = i;
            this.players[i].expectedToMove = true;
            this.players[i].turnsToWait = 0;
            this.players[i].saidMakao = false;
            this.players[i].cards = [];
            for (let j=0; j<5; j++) {
                this.players[i].cards.push(deck.pop());
            }
        }
        this.stack = [];
        this.stack.push(deck[0]);
        // this.stack.push(deck.pop());
        this.restOfCards = deck;
        this.lastMove = {player: null, action: "none"};
        this.special = {name: "none", value: null};
        this.toChoose = null;
        this.choosingPlayer = null;
        this.started = true;

        //debug start
        // this.players[0].cards.unshift(deck[3])
        // this.action(this.players[0], 'play-card', 0);
        // this.players[1].cards.unshift(deck[0])
        // this.action(this.players[1], 'play-card', 0);
        // this.players[1].cards.unshift(deck[16])
        // this.action(this.players[1], 'play-card', 0);
        // this.players[1].cards.unshift(deck[29])
        // this.action(this.players[1], 'play-card', 0);
        // this.action(this.players[2], 'draw-card', 0);

        let s=[];for(let c of this.stack)s.push(c.name);console.log(s);
        if(this.special.name!='none')console.log(this.special.name+' '+this.special.value);
        //debug stop
        return true;
    }

    action(player, action, arg) {
        if (!this.started) {
            console.log(`can't perform action, game ${this.id} is't started yet`);
            return false;
        }

        if (this.toChoose && (["play-card", "draw-card"].includes(action) || (player != this.choosingPlayer))) {
            console.log(`Player ${this.choosingPlayer.login} must choose`);
            return false;
        }

        if ((player.turnsToWait > 0) && ["play-card", "draw-card"].includes(action)) {
            console.log(`${player.login} can't play, because he must wait ${player.turnsToWait} turns more`);
            return false;
        }

        switch (action) {

            case "play-card":
                if (arg >= player.cards.length) break;

                let card = player.cards[arg];
                let stackCard = this.stack[this.stack.length-1];

                let sameSymbols = stackCard.symbol == card.symbol;
                let sameSuits = stackCard.suit == card.suit;
                let continuing = this.lastMove.player == player && this.lastMove.action == action;

                let canPlay = false;
                if (
                    (sameSuits && sameSymbols) ||
                    (continuing && sameSymbols)
                ) {
                    canPlay = true;
                }
                
                if (player.expectedToMove) {
                    switch (this.special.name) {
                        case "suit-change":
                            if (this.special.value == card.suit) canPlay = true;
                        break;
                        case "demand":
                            if (card.symbol == this.special.value || card.symbol == 'J') canPlay = true;
                        break;
                        case "turns-to-wait":
                            if (card.symbol == '4') canPlay = true;
                        break;
                        default:
                            if (sameSuits || sameSymbols) canPlay = true;
                    }
                    if (this.lastMove.player != player && canPlay) {
                        this.stayTurnOfPlayerBefore(player.index);
                    }
                }

                if (canPlay) {
                    player.cards.splice(arg, 1);
                    this.stack.push(card);
                    player.saidMakao = false;

                    this.lastMove = {player: player, action: action};

                    if (this.special.name == "suit-change" || this.special.name == "demand") {
                        this.special = {name: "none", value: null};
                    }
                    card.onPlay?.(this);

                    console.log(`${player.login} played ${card.name}`);

                    this.expectToMove(player.index);
                    return true;
                } else {
                    console.log(`${player.login} can't play ${card.name}`);
                }
            break;
                
            case "draw-card":
                if (this.special.name == "turns-to-wait" && player.expectedToMove && this.lastMove.player != player) {
                    player.turnsToWait = this.special.value;
                    this.special = {name: "none", value: null};
                    this.stayTurnOfPlayerBefore(player.index);
                    console.log(`${player.login} must wait ${player.turnsToWait} turns`);
                    this.expectToMove(player.index);
                    return true;
                }

                let playerDrawed = this.lastMove.player == player && this.lastMove.action == action;
                if (player.expectedToMove && !playerDrawed) {
                    let card = this.restOfCards.pop();
                    player.cards.push(card);
                    player.saidMakao = false;
                    this.lastMove = {player: player, action: action};
                    this.stayTurnOfPlayerBefore(player.index);

                    console.log(`${player.login} drew ${card.name}`);

                    this.expectToMove(player.index);
                    player.expectedToMove = true;
                    return true;
                } else {
                    console.log(`${player.login} can't draw card`);
                }
            break;

            case "choose":
                if (this.toChoose) {
                    let choice = this.toChoose[arg];
                    switch (this.toChoose) {
                        case suits:
                            this.special.name = "suit-change";
                        break;
                        case symbols:
                            this.special.name = "demand";
                        break;
                        default:
                            console.log("invalid choice");
                            return false;
                    }
                    this.special.value = choice;
                    this.toChoose = null;
                    console.log(`${player.login} choosing ${choice}`);
                    return true;
                } else {
                    console.log(`${player.login} can't choose`);
                }
            break;

            case "say-makao":
                player.saidMakao = true;
                console.log(`${player.login} said MAKAO`);
                return true;
            break;

            case "report-makao":
                let reportedPlayer = this.players[arg];
                if (!reportedPlayer?.saidMakao && reportedPlayer.cards.length == 1) {
                    for (let i=0; i<5; i++) {
                        let card = this.restOfCards.pop();
                        reportedPlayer.cards.push(card);
                    }
                    console.log(`${reportedPlayer.login} was reported by ${player.login} and reived 5 cards`);
                    return true;
                }
            break;
            
        }
        return false;
    }

    stayTurnOfPlayerBefore(currentPlayerIndex) {
        let playerBeforeIndex;
        if (currentPlayerIndex==0) {
            playerBeforeIndex = this.players.length-1;
        } else {
            playerBeforeIndex = currentPlayerIndex-1;
        } 
        let playerBefore = this.players[playerBeforeIndex];
        if (playerBefore.turnsToWait > 0) {
            playerBefore.turnsToWait--;
            console.log(`${playerBefore.login} must wait ${playerBefore.turnsToWait} turns more`);
        }
    }

    expectToMove(currentPlayerIndex) {
        for (let p of this.players) p.expectedToMove = false;
        let i = (currentPlayerIndex+1) % this.players.length;
        let p;
        let allMustWait = false;
        do {
            p = this.players[i];
            i = (i+1) % this.players.length;
            if (allMustWait) {
                p.turnsToWait--;
                console.log(`${p.login} must wait ${p.turnsToWait} turns more`);
            }
            if (p.turnsToWait == 0) p.expectedToMove = true;
            if (i == currentPlayerIndex) allMustWait = true;

        } while (!p.expectedToMove);

        console.log(`${p.login} is expected to move`);
    }

    getState(player) {
        let state = {};
        state.cards = player.cards;
        state.expectedToMove = player.expectedToMove;
        state.turnsToWait = player.turnsToWait;
        state.stackTop = this.stack[this.stack.length-1];
        state.others = [];
        for (let p of this.players) {
            let o = {};
            o.login = p.login;
            o.index = p.index;
            o.expectedToMove = p.expectedToMove;
            o.turnsToWait = p.turnsToWait;
            o.saidMakao = p.saidMakao;
            o.cardsQuantity = p.cards.length;
            state.others.push(o);
        }
        state.toChoose = (player == this.choosingPlayer) ? this.toChoose : null;
        state.special = this.special;
        return state;
    }
}

const suits = ['♥', '♣', '♦', '♠'];
const symbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'D', 'K'];

function setOnplays(game, deck) {
    for (let i=0; i<deck.length; i++) {
        let card = deck[i];
        switch (card.symbol) {
            case 'A':
                card.onPlay = (game) => {
                    game.choosingPlayer = game.lastMove.player;
                    game.toChoose = suits;
                }
            break;
            case 'J':
                card.onPlay = (game) => {
                    game.choosingPlayer = game.lastMove.player;
                    game.toChoose = symbols;
                }
            break;
            case '4':
                card.onPlay = (game) => {
                    if (game.special.name == "turns-to-wait") {
                        game.special.value ++;
                    } else {
                        game.special.name = "turns-to-wait";
                        game.special.value = 1;
                    }
                }
            break;
        }
    }
    return deck;
}

module.exports = {
    Makao: Makao,
}
