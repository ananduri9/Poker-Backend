export default class Deck {
    suits = ['c', 'd', 'h', 's'];
    deck = new Array();
    
    constructor() {
        for (var i = 2; i <= 9; i++) {
            this.suits.forEach(suit => {
                this.deck.push({
                    number: i.toString(), 
                    suit: suit
                });
            })
        }
        ['T', 'J', 'Q', 'K', 'A'].forEach(num => {
            this.suits.forEach(suit => {
                this.deck.push({
                    number: num,
                    suit: suit
                });
            })
        })
    }

    shuffle() {
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
        
        return this.deck
    }


}