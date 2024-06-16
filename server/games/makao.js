const {Game} = require('./game')

class Makao extends Game {
    start() {
        if (this.started) {
            console.log(`game ${this.id} already started`);
            return false;
        }
        let deck = this.getDeck().concat(this.getDeck());
        deck = setOnplays(deck);
        deck = this.shuffle(deck);
        this.restOfCards = deck;
        for(let i=0; i<this.players.length; i++) {
            this.players[i].finished = false;
            this.players[i].expectedToMove = true;
            this.players[i].turnsToWait = 0;
            this.players[i].saidMakao = false;
            this.players[i].cards = [];
            for (let j=0; j<5; j++) {
                this.players[i].cards.push(this.drawCard());
            }
        }
        this.stack = [];
        // this.stack.push(deck[0]);
        this.stack.push(this.drawCard());
        this.lastMove = {player: null, action: "none"};
        this.special = {name: "none", value: null};
        this.toChoose = null;
        this.choosingPlayer = null;
        this.started = true;
        this.playerExpectedOnceAgain = false;

        //debug start
        let s=[];for(let c of this.stack)s.push(c.name);console.log(s);
        // let cs=[];for(let c of this.players[0].cards)cs.push(c.name);console.log(cs);
        for(let p of this.players)if(p.expectedToMove)console.log(`${p.login} expected to move`);
        console.log(this.special.name+' '+this.special.value);
        //debug stop
        return true;
    }

    action(player, action, arg) {
        if (!this.started || this.ended) {
            console.log(`can't perform action, game ${this.id} is't running`);
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
                let cutsIn = sameSuits && sameSymbols;

                let canPlay = false;
                if (cutsIn || (continuing && sameSymbols)) {
                    canPlay = true;
                }
                
                if (player.expectedToMove) {
                    if (sameSuits && card.symbol=='Q') {
                        canPlay = true;
                    }
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
                        case "cards-to-draw":
                            if (card.battle && (sameSuits || sameSymbols)) canPlay = true;
                        break;
                        default:
                            if (sameSuits || sameSymbols) canPlay = true;
                    }
                }

                if (canPlay) {

                    if (this.lastMove.player!=player && !cutsIn) {
                        this.stayTurnOfPlayerBefore(player.index);
                    }

                    player.cards.splice(arg, 1);
                    this.stack.push(card);
                    if (player.cards.length == 0) {
                        player.finished = true;
                        if (this.players.length <= 1) {
                            this.ended = true;
                        }
                    }
                    player.saidMakao = false;

                    this.lastMove = {player: player, action: action};

                    if (this.special.name == "suit-change" || this.special.name == "demand") {
                        this.special = {name: "none", value: null};
                    }
                    card.onPlay?.(this);

                    console.log(`${player.login} played ${card.name}`);

                    this.expectNextPlayer(player.index);
                    return true;
                } else {
                    console.log(`${player.login} can't play ${card.name}`);
                }
            break;
                
            case "draw-card":
                if (this.special.name == "turns-to-wait" && player.expectedToMove) {
                    player.turnsToWait = this.special.value;
                    this.stayTurnOfPlayerBefore(player.index);
                    this.lastMove = {player: player, action: "accept-turns-to-wait"};
                    this.special = {name: "none", value: null};
                    console.log(`${player.login} must wait ${player.turnsToWait} turns`);
                    this.expectNextPlayer(player.index);
                    return true;
                }

                let playerDrawed = this.lastMove.player == player && this.lastMove.action == action;
                if (player.expectedToMove) {
                    let cardsToDraw = 0;
                    let moreThenOneCardDrawed = false;
                    if (playerDrawed && !this.playerExpectedOnceAgain) {
                        if (this.special.name == "cards-to-draw") {
                            cardsToDraw = this.special.value-1;
                            this.special = {name: "none", value: null};
                            moreThenOneCardDrawed = true;
                        }
                    } else {
                        cardsToDraw = 1;
                    }
                    if (cardsToDraw > 0) {
                        this.stayTurnOfPlayerBefore(player.index);
                        let card;
                        for (let i=cardsToDraw; i>0; i--) {
                            card = this.drawCard();
                            player.cards.push(card);
                        }
                        player.saidMakao = false;
                        this.lastMove = {player: player, action: action};
    
                        let moreStr = moreThenOneCardDrawed ? `and ${cardsToDraw-1} cards more` : "";
                        console.log(`${player.login} drew ${card.name} ${moreStr}`);
    
                        this.expectNextPlayer(player.index);
                        if (!moreThenOneCardDrawed) {
                            player.expectedToMove = true;
                        }
                        return true;
                    }
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
                        let card = this.drawCard();
                        reportedPlayer.cards.push(card);
                    }
                    console.log(`${reportedPlayer.login} was reported by ${player.login} and reived 5 cards`);
                    return true;
                }
            break;
            
        }
        return false;
    }

    drawCard() {
        let card = this.restOfCards.pop();
        if (this.restOfCards.length == 0) {
            this.restOfCards = this.shuffle(this.getDeck());
        }
        return card;
    }

    stayTurnOfPlayerBefore(currentPlayerIndex) {
        this.playerExpectedOnceAgain = false;
        let i = currentPlayerIndex;
        i = i==0 ? this.players.length-1 : i-1;
        let p = this.players[i];
        while (p.turnsToWait > 0 || p.finished) {
            if (p.finished) continue;
            p.turnsToWait--;
            console.log(`${p.login} must wait ${p.turnsToWait} turns more`);
            i = i==0 ? this.players.length-1 : i-1;
            p = this.players[i];
            if (p.index == currentPlayerIndex) this.playerExpectedOnceAgain = true;
        }
    }

    expectNextPlayer(currentPlayerIndex) {
        for (let p of this.players) p.expectedToMove = false;
        let diffrenceToNextPlayer = 1;
        if (['K♥', 'K♠'].includes(this.stackTop.name)) {
            diffrenceToNextPlayer = 0;
            for (let j=this.stack.length-1; j>=0; j--) {
                switch (this.stack[j].name) {
                    case 'K♥':
                        diffrenceToNextPlayer++;
                    break;
                    case 'K♠':
                        diffrenceToNextPlayer--;
                    break;
                    default:
                        j=-1;
                }
            }
        }
        let KpikOnTop = this.stackTop.name == 'K♠';
        let i = currentPlayerIndex;
        let p;
        do {
            i = (i+diffrenceToNextPlayer) % this.players.length;
            if (i < 0) i = this.players.length + diffrenceToNextPlayer;
            diffrenceToNextPlayer = KpikOnTop ? -1 : 1;
            p = this.players[i];
            if (!p.finished && p.turnsToWait == 0) p.expectedToMove = true;
        } while (!p.expectedToMove);
        diffrenceToNextPlayer = 1;

        // console.log(`${p.login} is expected to move`);
    }

    getState(player) {
        let state = {};
        state.finished = player.finished;
        state.gameEnded = this.ended;
        state.cards = player.cards;
        state.expectedToMove = player.expectedToMove;
        state.turnsToWait = player.turnsToWait;
        state.stackTop = this.stackTop;
        state.others = [];
        for (let p of this.players) {
            let o = {};
            o.login = p.login;
            o.index = p.index;
            o.finished = p.finished;
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

    get stackTop() {
        return this.stack[this.stack.length-1];
    }

    onRemovePlayer(user) {
        if (this.started && user.expectedToMove) {
            this.expectNextPlayer(user.index);
        }
        if (this.players.length <= 1) {
            this.ended = true;
        }
    }
}

const suits = ['♥', '♣', '♦', '♠'];
const symbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function setOnplays(deck) {
    for (let i=0; i<deck.length; i++) {
        let card = deck[i];
        card.battle = false;
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
            case '2':
                card.battle = true;
                card.onPlay = (game) => {
                    if (game.special.name == "cards-to-draw") {
                        game.special.value += 2;
                    } else {
                        game.special.name = "cards-to-draw";
                        game.special.value = 2;
                    }
                }
            break;
            case '3':
                card.battle = true;
                card.onPlay = (game) => {
                    if (game.special.name == "cards-to-draw") {
                        game.special.value += 3;
                    } else {
                        game.special.name = "cards-to-draw";
                        game.special.value = 3;
                    }
                }
            break;
            case 'K':
                switch (card.suit) {
                    case '♥':
                    case '♠':
                        card.battle = true;
                        card.onPlay = (game) => {
                            if (game.special.name == "cards-to-draw") {
                                game.special.value += 5;
                            } else {
                                game.special.name = "cards-to-draw";
                                game.special.value = 5;
                            }
                        }
                    break;
                }
            break;
            case 'Q':
                card.onPlay = (game) => {
                    game.special = {name: "none", value: null};
                }
            break;
        }
    }
    return deck;
}

module.exports = {
    Makao: Makao,
}
