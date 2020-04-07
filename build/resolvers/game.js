"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServer = require("apollo-server");

var _apolloServerExpress = require("apollo-server-express");

var _subscription = _interopRequireWildcard(require("../subscription"));

var _pokerLifeCycle = require("../helpers/pokerLifeCycle");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  Query: {
    game: function () {
      var _game = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, _ref, _ref2) {
        var id, models, game;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = _ref.id;
                models = _ref2.models;
                game = models.Game.findOne({
                  _id: id
                });

                if (game) {
                  _context.next = 5;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 5:
                return _context.abrupt("return", game);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function game(_x, _x2, _x3) {
        return _game.apply(this, arguments);
      }

      return game;
    }(),
    getData: function () {
      var _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, _ref3, _ref4) {
        var gameId, models, game;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                gameId = _ref3.gameId;
                models = _ref4.models;
                _context2.next = 4;
                return models.Game.findOne({
                  _id: gameId
                });

              case 4:
                game = _context2.sent;

                if (game) {
                  _context2.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 7:
                _context2.prev = 7;
                _context2.next = 10;
                return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
                  change: game
                });

              case 10:
                _context2.next = 16;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](7);
                console.error(_context2.t0);
                throw new _apolloServerExpress.UserInputError('Failed to publish game.');

              case 16:
                return _context2.abrupt("return", true);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[7, 12]]);
      }));

      function getData(_x4, _x5, _x6) {
        return _getData.apply(this, arguments);
      }

      return getData;
    }()
  },
  Mutation: {
    createGame: function () {
      var _createGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, _ref5, _ref6) {
        var sBlind, bBlind, models, game;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                sBlind = _ref5.sBlind, bBlind = _ref5.bBlind;
                models = _ref6.models;
                game = new models.Game({
                  potSize: 0,
                  smallBlind: sBlind,
                  bigBlind: bBlind,
                  dealer: 0,
                  numPlayers: 0,
                  table: [],
                  prevPotSize: 0,
                  state: "notStarted"
                });

                if (game) {
                  _context3.next = 5;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to create new game.');

              case 5:
                _context3.prev = 5;
                _context3.next = 8;
                return game.save();

              case 8:
                _context3.next = 14;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](5);
                console.error(_context3.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 14:
                _context3.prev = 14;
                _context3.next = 17;
                return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
                  change: game
                });

              case 17:
                _context3.next = 23;
                break;

              case 19:
                _context3.prev = 19;
                _context3.t1 = _context3["catch"](14);
                console.error(_context3.t1);
                throw new _apolloServerExpress.UserInputError('Failed to publish game.');

              case 23:
                return _context3.abrupt("return", game.id);

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[5, 10], [14, 19]]);
      }));

      function createGame(_x7, _x8, _x9) {
        return _createGame.apply(this, arguments);
      }

      return createGame;
    }(),
    joinGame: function () {
      var _joinGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, _ref7, _ref8) {
        var gameId, models, game;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                gameId = _ref7.gameId;
                models = _ref8.models;
                _context4.next = 4;
                return models.Game.findOne({
                  _id: gameId
                });

              case 4:
                game = _context4.sent;

                if (game) {
                  _context4.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 7:
                _context4.prev = 7;
                _context4.next = 10;
                return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
                  change: game
                });

              case 10:
                _context4.next = 16;
                break;

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](7);
                console.error(_context4.t0);
                throw new _apolloServerExpress.UserInputError('Failed to publish game.');

              case 16:
                return _context4.abrupt("return", true);

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[7, 12]]);
      }));

      function joinGame(_x10, _x11, _x12) {
        return _joinGame.apply(this, arguments);
      }

      return joinGame;
    }(),
    startGame: function () {
      var _startGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, _ref9, _ref10) {
        var gameId, me, models, game, user, player;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                gameId = _ref9.gameId;
                me = _ref10.me, models = _ref10.models;
                _context5.next = 4;
                return models.Game.findOne({
                  _id: gameId
                });

              case 4:
                game = _context5.sent;

                if (game) {
                  _context5.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 7:
                _context5.next = 9;
                return models.User.findOne({
                  _id: me.id
                });

              case 9:
                user = _context5.sent;

                if (user) {
                  _context5.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid user.');

              case 12:
                _context5.next = 14;
                return models.Player.findOne({
                  _id: user.player,
                  game: gameId,
                  standing: false
                });

              case 14:
                player = _context5.sent;

                if (user) {
                  _context5.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid player.');

              case 17:
                game.dealer = player.position;
                _context5.prev = 18;
                _context5.next = 21;
                return game.save();

              case 21:
                _context5.next = 27;
                break;

              case 23:
                _context5.prev = 23;
                _context5.t0 = _context5["catch"](18);
                console.error(_context5.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 27:
                _context5.next = 29;
                return (0, _pokerLifeCycle.startNewHand)(gameId, models);

              case 29:
                return _context5.abrupt("return", true);

              case 30:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[18, 23]]);
      }));

      function startGame(_x13, _x14, _x15) {
        return _startGame.apply(this, arguments);
      }

      return startGame;
    }(),
    bet: function () {
      var _bet = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, _ref11, _ref12) {
        var position, amount, gameId, me, models, user, player, game;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                position = _ref11.position, amount = _ref11.amount, gameId = _ref11.gameId;
                me = _ref12.me, models = _ref12.models;
                _context6.next = 4;
                return models.User.findOne({
                  _id: me.id
                });

              case 4:
                user = _context6.sent;

                if (user) {
                  _context6.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find valid user.');

              case 7:
                _context6.next = 9;
                return models.Player.findOne({
                  _id: user.player,
                  game: gameId
                });

              case 9:
                player = _context6.sent;

                if (player) {
                  _context6.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player user.');

              case 12:
                _context6.next = 14;
                return models.Game.findOne({
                  _id: gameId
                });

              case 14:
                game = _context6.sent;

                if (game) {
                  _context6.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 17:
                player.stack -= amount;

                if (player.betAmount == -1) {
                  player.betAmount = amount;
                } else {
                  player.betAmount += amount;
                }

                game.potSize += amount;
                game.curBet = player.betAmount;
                _context6.prev = 21;
                _context6.next = 24;
                return player.save();

              case 24:
                _context6.next = 26;
                return game.save();

              case 26:
                _context6.next = 32;
                break;

              case 28:
                _context6.prev = 28;
                _context6.t0 = _context6["catch"](21);
                console.error(_context6.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 32:
                (0, _pokerLifeCycle.findNext)(models, player.position, gameId, "bet");
                return _context6.abrupt("return", true);

              case 34:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[21, 28]]);
      }));

      function bet(_x16, _x17, _x18) {
        return _bet.apply(this, arguments);
      }

      return bet;
    }(),
    allIn: function () {
      var _allIn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parent, _ref13, _ref14) {
        var position, gameId, me, models, user, player, game;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                position = _ref13.position, gameId = _ref13.gameId;
                me = _ref14.me, models = _ref14.models;
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

                if (player) {
                  _context7.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player user.');

              case 12:
                _context7.next = 14;
                return models.Game.findOne({
                  _id: gameId
                });

              case 14:
                game = _context7.sent;

                if (game) {
                  _context7.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Incorrect game id.');

              case 17:
                player.isAllIn = true;
                player.stack = 0;

                if (player.betAmount == -1) {
                  player.betAmount = player.stack;
                } else {
                  player.betAmount += player.stack;
                }

                game.curBet = player.betAmount;
                game.potSize += player.stack;
                game.handleAllIn = true;
                _context7.prev = 23;
                _context7.next = 26;
                return player.save();

              case 26:
                _context7.next = 28;
                return game.save();

              case 28:
                _context7.next = 34;
                break;

              case 30:
                _context7.prev = 30;
                _context7.t0 = _context7["catch"](23);
                console.error(_context7.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 34:
                (0, _pokerLifeCycle.findNext)(models, player.position, gameId, "allIn");
                return _context7.abrupt("return", true);

              case 36:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[23, 30]]);
      }));

      function allIn(_x19, _x20, _x21) {
        return _allIn.apply(this, arguments);
      }

      return allIn;
    }(),
    fold: function () {
      var _fold = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, _ref15, _ref16) {
        var position, gameId, me, models, user, player;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                position = _ref15.position, gameId = _ref15.gameId;
                me = _ref16.me, models = _ref16.models;
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

                if (player) {
                  _context8.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player user.');

              case 12:
                // const player = await models.Player.findOne({ position: position, game: gameId });
                player.isFolded = true;
                _context8.next = 15;
                return player.save();

              case 15:
                _context8.prev = 15;
                _context8.next = 18;
                return player.save();

              case 18:
                _context8.next = 24;
                break;

              case 20:
                _context8.prev = 20;
                _context8.t0 = _context8["catch"](15);
                console.error(_context8.t0);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 24:
                (0, _pokerLifeCycle.findNext)(models, player.position, gameId, "fold");
                return _context8.abrupt("return", true);

              case 26:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[15, 20]]);
      }));

      function fold(_x22, _x23, _x24) {
        return _fold.apply(this, arguments);
      }

      return fold;
    }()
  },
  Subscription: {
    change: {
      subscribe: (0, _apolloServer.withFilter)(function () {
        return _subscription["default"].asyncIterator(_subscription.EVENTS.PLAYER.CREATED);
      }, function (payload, variables) {
        return variables.gameId === payload.change.id;
      })
    }
  },
  Game: {
    players: function () {
      var _players = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(game, args, _ref17) {
        var models, player;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                models = _ref17.models;
                _context9.next = 3;
                return models.Player.find({
                  game: game.id,
                  standing: false
                });

              case 3:
                player = _context9.sent;

                if (player) {
                  _context9.next = 6;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Failed to find player user.');

              case 6:
                return _context9.abrupt("return", player);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function players(_x25, _x26, _x27) {
        return _players.apply(this, arguments);
      }

      return players;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=game.js.map