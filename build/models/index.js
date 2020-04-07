"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.connectDb = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _game = _interopRequireDefault(require("./game"));

var _user = _interopRequireDefault(require("./user"));

var _player = _interopRequireDefault(require("./player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var connectDb = function connectDb() {
  return _mongoose["default"].connect(process.env.DATABASE_URL);
};

exports.connectDb = connectDb;
var models = {
  User: _user["default"],
  Game: _game["default"],
  Player: _player["default"]
};
var _default = models;
exports["default"] = _default;
//# sourceMappingURL=index.js.map