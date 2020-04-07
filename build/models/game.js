"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var gameSchema = new _mongoose["default"].Schema({
  potSize: {
    type: Number,
    required: true
  },
  dealer: {
    type: Number,
    required: true
  },
  smallBlind: {
    type: Number,
    required: true
  },
  bigBlind: {
    type: Number,
    required: true
  },
  numPlayers: {
    type: Number,
    required: true
  },
  table: {
    type: [Object]
  },
  state: {
    type: String
  },
  curBet: {
    type: Number
  },
  action: {
    type: Number
  },
  deck: {
    type: [Object]
  },
  allIn: {
    type: Boolean
  },
  handleAllIn: {
    type: Boolean
  },
  sidePot: {
    type: [Object]
  },
  prevPotSize: {
    type: Number
  },
  players: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Player'
  }]
});
gameSchema.pre('remove', function (next) {
  this.model('Player')["delete"]({
    game: this._id
  }, next);
});

var Game = _mongoose["default"].model('Game', gameSchema);

var _default = Game;
exports["default"] = _default;
//# sourceMappingURL=game.js.map