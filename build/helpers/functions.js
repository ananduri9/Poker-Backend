"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePlayer = void 0;

var _apolloServerExpress = require("apollo-server-express");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var removePlayer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(position, gameId, models) {
    var game;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return models.Game.findOne({
              _id: gameId
            });

          case 2:
            game = _context.sent;

            if (game) {
              _context.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 5:
            game.numPlayers -= 1;
            game.players.filter(function (player) {
              player.position != position;
            });
            _context.prev = 7;
            _context.next = 10;
            return game.save();

          case 10:
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](7);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 15:
            _context.prev = 15;
            _context.next = 18;
            return models.Player.findOneAndRemove({
              position: position,
              game: gameId
            });

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t1 = _context["catch"](15);
            throw new _apolloServerExpress.UserInputError('Failed to delete player');

          case 23:
            return _context.abrupt("return", true);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 12], [15, 20]]);
  }));

  return function removePlayer(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.removePlayer = removePlayer;
//# sourceMappingURL=functions.js.map