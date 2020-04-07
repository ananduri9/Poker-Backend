"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _subscription = _interopRequireWildcard(require("../subscription"));

var _functions = require("../helpers/functions");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  Query: {
    player: function () {
      var _player = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, _ref, _ref2) {
        var position, gameId, models, player;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                position = _ref.position, gameId = _ref.gameId;
                models = _ref2.models;
                _context.next = 4;
                return models.Player.findOne({
                  position: position,
                  game: gameId
                });

              case 4:
                player = _context.sent;

                if (player) {
                  _context.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player. Incorrect position or game id.');

              case 7:
                return _context.abrupt("return", player);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function player(_x, _x2, _x3) {
        return _player.apply(this, arguments);
      }

      return player;
    }(),
    players: function () {
      var _players = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3) {
        var models;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                models = _ref3.models;
                return _context2.abrupt("return", models.Player.find({}));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function players(_x4, _x5, _x6) {
        return _players.apply(this, arguments);
      }

      return players;
    }()
  },
  Mutation: {
    createPlayer: function () {
      var _createPlayer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, _ref4, _ref5) {
        var stack, position, gameId, me, models, game, user, admin, player;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                stack = _ref4.stack, position = _ref4.position, gameId = _ref4.gameId;
                me = _ref5.me, models = _ref5.models;
                _context3.next = 4;
                return models.Game.findOne({
                  _id: gameId
                });

              case 4:
                game = _context3.sent;

                if (game) {
                  _context3.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 7:
                _context3.next = 9;
                return models.User.findOne({
                  _id: me.id
                });

              case 9:
                user = _context3.sent;

                if (user) {
                  _context3.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid user.');

              case 12:
                admin = false;

                if (game.numPlayers == 0) {
                  admin = true;
                }

                player = new models.Player({
                  stack: stack,
                  position: position,
                  hand: null,
                  betAmount: -1,
                  standing: false,
                  requestStanding: false,
                  requestSitting: false,
                  admin: admin,
                  game: gameId,
                  user: me.id
                });

                if (player) {
                  _context3.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to create new player.');

              case 17:
                game.numPlayers += 1;
                user.player = player.id;
                game.players.push(player);
                _context3.prev = 20;
                _context3.next = 23;
                return user.save();

              case 23:
                _context3.next = 25;
                return game.save();

              case 25:
                _context3.next = 27;
                return player.save();

              case 27:
                _context3.next = 33;
                break;

              case 29:
                _context3.prev = 29;
                _context3.t0 = _context3["catch"](20);
                console.error(_context3.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 33:
                _context3.prev = 33;
                _context3.next = 36;
                return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
                  change: game
                });

              case 36:
                _context3.next = 42;
                break;

              case 38:
                _context3.prev = 38;
                _context3.t1 = _context3["catch"](33);
                console.error(_context3.t1);
                throw new _apolloServerExpress.UserInputError('Failed to publish game.');

              case 42:
                return _context3.abrupt("return", true);

              case 43:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[20, 29], [33, 38]]);
      }));

      function createPlayer(_x7, _x8, _x9) {
        return _createPlayer.apply(this, arguments);
      }

      return createPlayer;
    }(),
    updateStack: function () {
      var _updateStack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, _ref6, _ref7) {
        var position, stack, gameId, models, player;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                position = _ref6.position, stack = _ref6.stack, gameId = _ref6.gameId;
                models = _ref7.models;
                _context4.next = 4;
                return models.Player.findOne({
                  position: position,
                  game: gameId
                });

              case 4:
                player = _context4.sent;

                if (game) {
                  _context4.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id or position.');

              case 7:
                player.stack = stack;
                _context4.prev = 8;
                _context4.next = 11;
                return player.save();

              case 11:
                _context4.next = 17;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](8);
                console.error(_context4.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 17:
                return _context4.abrupt("return", true);

              case 18:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[8, 13]]);
      }));

      function updateStack(_x10, _x11, _x12) {
        return _updateStack.apply(this, arguments);
      }

      return updateStack;
    }(),
    removePlayer: function () {
      var _removePlayer2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, _ref8, _ref9) {
        var position, gameId, models;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                position = _ref8.position, gameId = _ref8.gameId;
                models = _ref9.models;
                _context5.next = 4;
                return (0, _functions.removePlayer)(position, gameId, models);

              case 4:
                return _context5.abrupt("return", _context5.sent);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function removePlayer(_x13, _x14, _x15) {
        return _removePlayer2.apply(this, arguments);
      }

      return removePlayer;
    }(),
    player: function () {
      var _player2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, _ref10, _ref11) {
        var position, gameId, models, player;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                position = _ref10.position, gameId = _ref10.gameId;
                models = _ref11.models;
                _context6.next = 4;
                return models.Player.findOne({
                  position: position,
                  game: gameId
                });

              case 4:
                player = _context6.sent;

                if (player) {
                  _context6.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player. Incorrect position or game id.');

              case 7:
                return _context6.abrupt("return", player);

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function player(_x16, _x17, _x18) {
        return _player2.apply(this, arguments);
      }

      return player;
    }(),
    sit: function () {
      var _sit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parent, _ref12, _ref13) {
        var gameId, me, models, user, player;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                gameId = _ref12.gameId;
                me = _ref13.me, models = _ref13.models;
                _context7.next = 4;
                return models.User.findOne({
                  _id: me.id
                });

              case 4:
                user = _context7.sent;

                if (user) {
                  _context7.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid user.');

              case 7:
                _context7.next = 9;
                return models.Player.findOne({
                  _id: user.player,
                  game: gameId
                });

              case 9:
                player = _context7.sent;

                if (user) {
                  _context7.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid player. Incorrect game id.');

              case 12:
                player.requestSitting = true;
                _context7.prev = 13;
                _context7.next = 16;
                return player.save();

              case 16:
                _context7.next = 22;
                break;

              case 18:
                _context7.prev = 18;
                _context7.t0 = _context7["catch"](13);
                console.error(_context7.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 22:
                return _context7.abrupt("return", true);

              case 23:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[13, 18]]);
      }));

      function sit(_x19, _x20, _x21) {
        return _sit.apply(this, arguments);
      }

      return sit;
    }(),
    stand: function () {
      var _stand = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, _ref14, _ref15) {
        var gameId, me, models, user, player;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                gameId = _ref14.gameId;
                me = _ref15.me, models = _ref15.models;
                _context8.next = 4;
                return models.User.findOne({
                  _id: me.id
                });

              case 4:
                user = _context8.sent;

                if (user) {
                  _context8.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid user.');

              case 7:
                _context8.next = 9;
                return models.Player.findOne({
                  _id: user.player,
                  game: gameId
                });

              case 9:
                player = _context8.sent;

                if (user) {
                  _context8.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid player. Incorrect game id.');

              case 12:
                _context8.prev = 12;
                _context8.next = 15;
                return player.save();

              case 15:
                _context8.next = 21;
                break;

              case 17:
                _context8.prev = 17;
                _context8.t0 = _context8["catch"](12);
                console.error(_context8.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 21:
                return _context8.abrupt("return", true);

              case 22:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[12, 17]]);
      }));

      function stand(_x22, _x23, _x24) {
        return _stand.apply(this, arguments);
      }

      return stand;
    }()
  },
  Player: {
    user: function () {
      var _user = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(player, args, _ref16) {
        var models, user;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                models = _ref16.models;
                _context9.next = 3;
                return models.User.findOne({
                  player: player.id
                });

              case 3:
                user = _context9.sent;

                if (user) {
                  _context9.next = 6;
                  break;
                }

                throw new ServerError('Failed to find valid user by player id.');

              case 6:
                return _context9.abrupt("return", user);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function user(_x25, _x26, _x27) {
        return _user.apply(this, arguments);
      }

      return user;
    }(),
    game: function () {
      var _game = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(player, args, _ref17) {
        var models, game;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                models = _ref17.models;
                _context10.next = 3;
                return models.Game.findOne({
                  player: player.id
                });

              case 3:
                game = _context10.sent;

                if (game) {
                  _context10.next = 6;
                  break;
                }

                throw new ServerError('Failed to find valid game by player id.');

              case 6:
                return _context10.abrupt("return", game);

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function game(_x28, _x29, _x30) {
        return _game.apply(this, arguments);
      }

      return game;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=player.js.map