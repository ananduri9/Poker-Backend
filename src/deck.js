export default class Deck {
  constructor () {
    this.deck = []
    this.suits = ['c', 'd', 'h', 's']

    for (var i = 2; i <= 9; i++) {
      this.suits.forEach(suit => {
        this.deck.push({
          number: i.toString(),
          suit: suit
        })
      })
    }
    ['T', 'J', 'Q', 'K', 'A'].forEach(num => {
      this.suits.forEach(suit => {
        this.deck.push({
          number: num,
          suit: suit
        })
      })
    })
  }

  shuffle () {
    for (var i = this.deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = this.deck[i]
      this.deck[i] = this.deck[j]
      this.deck[j] = temp
    }
  }

  popCard () {
    return this.deck.pop()
  }
};
