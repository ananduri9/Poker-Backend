"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Deck = /*#__PURE__*/function () {
  function Deck() {
    var _this = this;

    _classCallCheck(this, Deck);

    _defineProperty(this, "suits", ['c', 'd', 'h', 's']);

    _defineProperty(this, "deck", new Array());

    for (var i = 2; i <= 9; i++) {
      this.suits.forEach(function (suit) {
        _this.deck.push({
          number: i.toString(),
          suit: suit
        });
      });
    }

    ['T', 'J', 'Q', 'K', 'A'].forEach(function (num) {
      _this.suits.forEach(function (suit) {
        _this.deck.push({
          number: num,
          suit: suit
        });
      });
    });
  }

  _createClass(Deck, [{
    key: "shuffle",
    value: function shuffle() {
      for (var i = this.deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.deck[i];
        this.deck[i] = this.deck[j];
        this.deck[j] = temp;
      }

      return this.deck;
    } // popCard() {
    //     return this.deck.pop();
    // }

  }]);

  return Deck;
}();

exports["default"] = Deck;
;
//# sourceMappingURL=deck.js.map