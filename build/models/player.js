"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var playerSchema = new _mongoose["default"].Schema({
  stack: {
    type: Number,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  betAmount: {
    type: Number
  },
  isFolded: {
    type: Boolean
  },
  isAllIn: {
    type: Boolean
  },
  handleAllIn: {
    type: Boolean
  },
  hand: {
    type: Object
  },
  showCards: {
    type: Object
  },
  standing: {
    type: Boolean
  },
  requestStanding: {
    type: Boolean
  },
  requestSitting: {
    type: Boolean
  },
  admin: {
    type: Boolean
  },
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  },
  game: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Game'
  }
});

var Player = _mongoose["default"].model('Player', playerSchema);

var _default = Player;
exports["default"] = _default;
//# sourceMappingURL=player.js.map