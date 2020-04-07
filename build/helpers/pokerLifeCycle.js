"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findNext = exports.startNewHand = void 0;

var _pokersolver = require("pokersolver");

var _apolloServerExpress = require("apollo-server-express");

var _subscription = _interopRequireWildcard(require("../subscription"));

var _deck = _interopRequireDefault(require("../deck"));

var _functions = require("./functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAction = function getAction(players, curPos, numNext) {
  var livePlayers = players.filter(function (player) {
    return !player.isFolded && !player.isAllIn;
  });
  return getPosition(livePlayers, curPos, numNext);
};

var getPosition = function getPosition(players, curPos, numNext) {
  var nextIndex = getIndex(players, curPos, numNext);
  return players[nextIndex].position;
};

var getIndex = function getIndex(players, curPos, numNext) {
  var curIndex = players.map(function (player) {
    return player.position;
  }).indexOf(curPos);
  return (curIndex + numNext) % players.length;
};

var handleAllIns = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(gameId, models) {
    var game, players, playersAlive, playersAllIn, len, numRegular, prevBetAmount;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return models.Game.findOne({
              _id: gameId
            });

          case 2:
            game = _context2.sent;

            if (game) {
              _context2.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 5:
            _context2.next = 7;
            return models.Player.find({
              game: gameId,
              standing: false
            }).sort({
              position: 1
            });

          case 7:
            players = _context2.sent;

            if (players) {
              _context2.next = 10;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find players. Incorrect game id.');

          case 10:
            playersAlive = players.filter(function (player) {
              return !player.isFolded && !players.handleAllIn;
            });
            playersAllIn = playersAlive.filter(function (player) {
              return player.isAllIn && !players.handleAllIn;
            });
            playersAlive.sort(function (a, b) {
              return a.stack - b.stack;
            }); // Sort alive playersin ascending order of stack size

            len = playersAlive.length;

            if (playersAlive.length == playersAllIn.length) {
              // Person with biggest stack is all in no more
              playersAlive[len - 1].isAllIn = false;
              playersAlive[len - 1].stack = playersAlive[len - 1].betAmount - playersAlive[len - 2].betAmount;
              playersAlive[len - 1].betAmount = playersAlive[len - 1].betAmount - playersAlive[len - 1].stack;
              game.potSize -= playersAlive[len - 1].stack;
            }

            numRegular = 0;
            playersAlive.forEach(function (player) {
              if (!player.isAllIn) {
                numRegular += 1;
              } else {
                player.handleAllIn = true;
              }
            });

            if (numRegular == 1) {
              game.allIn = true; // Proceed all the way to show down and show cards

              playersAlive.forEach(function (player) {
                player.showCards = player.hand;
              });
            }

            prevBetAmount = 0; // Create side pots and push onto game stack

            playersAlive.forEach(function (player, index) {
              if (player.isAllIn) {
                var sidePotSize = (player.betAmount - prevBetAmount) * (len - index) + game.prevPotSize;
                game.sidePot.push({
                  size: sidePotSize,
                  positions: playersAlive.slice(index).map(function (player) {
                    return player.position;
                  })
                });
                game.potSize -= sidePotSize;
                prevBetAmount = player.betAmount;
                game.prevPotSize = 0;
              }
            });
            _context2.next = 22;
            return Promise.all(playersAlive.map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(player) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return player.save();

                      case 3:
                        _context.next = 9;
                        break;

                      case 5:
                        _context.prev = 5;
                        _context.t0 = _context["catch"](0);
                        console.error(_context.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 5]]);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 22:
            game.handleAllIn = false;
            _context2.prev = 23;
            _context2.next = 26;
            return game.save();

          case 26:
            _context2.next = 32;
            break;

          case 28:
            _context2.prev = 28;
            _context2.t0 = _context2["catch"](23);
            console.error(_context2.t0);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 32:
            return _context2.abrupt("return", true);

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[23, 28]]);
  }));

  return function handleAllIns(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var isBigBlindDuringPreflop = function isBigBlindDuringPreflop(game, players, index) {
  return game.state == "newRound" && index == getIndex(players, game.dealer, 2) && game.curBet == game.bigBlind;
};

var findNext = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(models, startPos, gameId, act) {
    var game, players, alive, aliveIndex, i, index, showDownplayers, showDownpositions, _iterator, _step, sidePot, size, positions;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return models.Game.findOne({
              _id: gameId
            });

          case 2:
            game = _context3.sent;

            if (game) {
              _context3.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 5:
            _context3.next = 7;
            return models.Player.find({
              game: gameId,
              standing: false
            }).sort({
              position: 1
            });

          case 7:
            players = _context3.sent;

            if (players) {
              _context3.next = 10;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find players. Incorrect game id.');

          case 10:
            alive = 0;
            i = 1;

          case 12:
            if (!(i < players.length)) {
              _context3.next = 42;
              break;
            }

            index = getIndex(players, startPos, i);

            if (players[index].isFolded) {
              _context3.next = 39;
              break;
            }

            alive += 1; // Keep track of number not folded

            if (players[index].isAllIn) {
              _context3.next = 39;
              break;
            }

            aliveIndex = index; // Keep track of last person alive

            if (!(players[index].betAmount != game.curBet || isBigBlindDuringPreflop(game, players, index))) {
              _context3.next = 39;
              break;
            }

            game.action = players[index].position; // Set action to next player to act

            _context3.prev = 20;
            _context3.next = 23;
            return game.save();

          case 23:
            _context3.next = 29;
            break;

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](20);
            console.error(_context3.t0);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 29:
            _context3.prev = 29;
            _context3.next = 32;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 32:
            _context3.next = 38;
            break;

          case 34:
            _context3.prev = 34;
            _context3.t1 = _context3["catch"](29);
            console.error(_context3.t1);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 38:
            return _context3.abrupt("return", true);

          case 39:
            i++;
            _context3.next = 12;
            break;

          case 42:
            if (!(act == "fold" && alive == 1)) {
              _context3.next = 57;
              break;
            }

            _context3.next = 45;
            return wins(game.potSize, players[aliveIndex].position, gameId, models, 1);

          case 45:
            _context3.prev = 45;
            _context3.next = 48;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 48:
            _context3.next = 54;
            break;

          case 50:
            _context3.prev = 50;
            _context3.t2 = _context3["catch"](45);
            console.error(_context3.t2);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 54:
            _context3.next = 56;
            return startNewHand(gameId, models);

          case 56:
            return _context3.abrupt("return", true);

          case 57:
            if (!(alive > 0)) {
              _context3.next = 106;
              break;
            }

            if (!game.handleAllIn) {
              _context3.next = 63;
              break;
            }

            _context3.next = 61;
            return handleAllIns(gameId, models);

          case 61:
            _context3.next = 63;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 63:
            if (!(game.state === "river")) {
              _context3.next = 103;
              break;
            }

            showDownplayers = players.filter(function (player) {
              return !player.isAllIn && !player.isFolded && player.betAmount == game.curBet;
            });
            showDownpositions = showDownplayers.map(function (player) {
              return player.position;
            }); // Handle all in side pots

            _iterator = _createForOfIteratorHelper(game.sidePot);
            _context3.prev = 67;

            _iterator.s();

          case 69:
            if ((_step = _iterator.n()).done) {
              _context3.next = 79;
              break;
            }

            sidePot = _step.value;
            console.log('sidepot');
            console.log(sidePot);
            size = sidePot.size, positions = sidePot.positions;
            _context3.next = 76;
            return showdown(size, positions, gameId, models);

          case 76:
            console.log(game.potSize);

          case 77:
            _context3.next = 69;
            break;

          case 79:
            _context3.next = 84;
            break;

          case 81:
            _context3.prev = 81;
            _context3.t3 = _context3["catch"](67);

            _iterator.e(_context3.t3);

          case 84:
            _context3.prev = 84;

            _iterator.f();

            return _context3.finish(84);

          case 87:
            // Handle normal showdown between >= 2 players
            console.log(showDownpositions);

            if (!(showDownplayers.length > 1)) {
              _context3.next = 91;
              break;
            }

            _context3.next = 91;
            return showdown(game.potSize, showDownpositions, gameId, models);

          case 91:
            _context3.prev = 91;
            _context3.next = 94;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 94:
            _context3.next = 100;
            break;

          case 96:
            _context3.prev = 96;
            _context3.t4 = _context3["catch"](91);
            console.error(_context3.t4);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 100:
            _context3.next = 102;
            return startNewHand(gameId, models);

          case 102:
            return _context3.abrupt("return", true);

          case 103:
            _context3.next = 105;
            return gotoNextRound(gameId, models);

          case 105:
            return _context3.abrupt("return", true);

          case 106:
            throw new GameStateError('Error, there are no live players!');

          case 107:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[20, 25], [29, 34], [45, 50], [67, 81, 84, 87], [91, 96]]);
  }));

  return function findNext(_x4, _x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.findNext = findNext;

var showdown = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(potSize, positions, gameId, models) {
    var game, players, tableCards, playerHands, solvedHands, winningCards, numWinners;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return models.Game.findOne({
              _id: gameId
            });

          case 2:
            game = _context5.sent;

            if (game) {
              _context5.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 5:
            _context5.next = 7;
            return models.Player.find({
              position: {
                $in: positions
              },
              standing: false,
              game: gameId
            }).sort({
              position: 1
            });

          case 7:
            players = _context5.sent;

            if (players) {
              _context5.next = 10;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find players. Incorrect game id.');

          case 10:
            tableCards = game.table.map(function (card) {
              return card.number + card.suit;
            });
            console.log(tableCards);
            console.log(players);
            playerHands = players.map(function (player) {
              console.log(player.hand);
              var card1 = player.hand.card1.number + player.hand.card1.suit;
              var card2 = player.hand.card2.number + player.hand.card2.suit;
              return [card1, card2].concat(_toConsumableArray(tableCards));
            });
            players.forEach(function (player, index) {
              player.hand = playerHands[index];
            });
            solvedHands = playerHands.map(function (hand) {
              return _pokersolver.Hand.solve(hand);
            });
            winningCards = _pokersolver.Hand.winners(solvedHands);
            numWinners = winningCards.length;
            _context5.next = 20;
            return Promise.all(winningCards.map( /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(cards) {
                var winners, winner, winnerHand;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        winners = cards.cardPool.map(function (card) {
                          return card.value + card.suit;
                        });
                        winner = players.find(function (player) {
                          return JSON.stringify(player.hand.sort()) === JSON.stringify(winners.sort());
                        });
                        console.log('alo');
                        console.log(winner.hand);
                        winnerHand = winner.hand.slice(0, 2);
                        winner.showCards = {
                          card1: {
                            number: winnerHand[0].substr(0, 1),
                            suit: winnerHand[0].substr(1, 1)
                          },
                          card2: {
                            number: winnerHand[1].substr(0, 1),
                            suit: winnerHand[1].substr(1, 1)
                          }
                        };
                        _context4.prev = 6;
                        _context4.next = 9;
                        return winner.save();

                      case 9:
                        _context4.next = 15;
                        break;

                      case 11:
                        _context4.prev = 11;
                        _context4.t0 = _context4["catch"](6);
                        console.error(_context4.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 15:
                        _context4.next = 17;
                        return wins(potSize, winner.position, gameId, models, numWinners);

                      case 17:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, null, [[6, 11]]);
              }));

              return function (_x12) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 20:
            return _context5.abrupt("return", true);

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function showdown(_x8, _x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

var wins = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(potSize, position, gameId, models, numWinners) {
    var player;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return models.Player.findOne({
              position: position,
              game: gameId
            });

          case 2:
            player = _context6.sent;

            if (player) {
              _context6.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find player. Invalid position.');

          case 5:
            player.stack += Math.floor(potSize / numWinners);
            _context6.prev = 6;
            _context6.next = 9;
            return player.save();

          case 9:
            _context6.next = 15;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](6);
            console.error(_context6.t0);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 15:
            return _context6.abrupt("return", true);

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[6, 11]]);
  }));

  return function wins(_x13, _x14, _x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}();

var startNewHand = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(gameId, models) {
    var players, game, _iterator2, _step2, player;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return models.Player.find({
              game: gameId
            }).sort({
              position: 1
            });

          case 2:
            players = _context8.sent;

            if (players) {
              _context8.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find players. Incorrect game id.');

          case 5:
            _context8.next = 7;
            return models.Game.findOne({
              _id: gameId
            });

          case 7:
            game = _context8.sent;

            if (game) {
              _context8.next = 10;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 10:
            // Remove player if stack went to 0
            _iterator2 = _createForOfIteratorHelper(players);
            _context8.prev = 11;

            _iterator2.s();

          case 13:
            if ((_step2 = _iterator2.n()).done) {
              _context8.next = 20;
              break;
            }

            player = _step2.value;

            if (!(player.stack <= 0)) {
              _context8.next = 18;
              break;
            }

            _context8.next = 18;
            return (0, _functions.removePlayer)(player.position, gameId, models);

          case 18:
            _context8.next = 13;
            break;

          case 20:
            _context8.next = 25;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t0 = _context8["catch"](11);

            _iterator2.e(_context8.t0);

          case 25:
            _context8.prev = 25;

            _iterator2.f();

            return _context8.finish(25);

          case 28:
            _context8.next = 30;
            return Promise.all(players.map( /*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(player) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (player.requestStanding) {
                          player.standing = true;
                        }

                        if (player.requestSitting) {
                          player.standing = false;
                        }

                        player.isFolded = false;
                        player.isAllIn = false;
                        player.handleAllIn = false;
                        player.hand = null;
                        player.showCards = null;
                        _context7.next = 9;
                        return player.save();

                      case 9:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x20) {
                return _ref8.apply(this, arguments);
              };
            }()));

          case 30:
            game.potSize = 0;
            game.sidePot = [];
            game.allIn = false;
            game.handleAllIn = false;
            game.dealer = getPosition(players, game.dealer, 1);
            game.table = [];
            game.state = "newRound";
            game.curBet = -1;
            game.prevPotSize = 0;
            _context8.prev = 39;
            _context8.next = 42;
            return game.save();

          case 42:
            _context8.next = 48;
            break;

          case 44:
            _context8.prev = 44;
            _context8.t1 = _context8["catch"](39);
            console.error(_context8.t1);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 48:
            _context8.prev = 48;
            _context8.next = 51;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 51:
            _context8.next = 57;
            break;

          case 53:
            _context8.prev = 53;
            _context8.t2 = _context8["catch"](48);
            console.error(_context8.t2);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 57:
            _context8.next = 59;
            return execState("preflop", gameId, models);

          case 59:
            return _context8.abrupt("return", true);

          case 60:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[11, 22, 25, 28], [39, 44], [48, 53]]);
  }));

  return function startNewHand(_x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();

exports.startNewHand = startNewHand;

var gotoNextRound = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(gameId, models) {
    var game;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return models.Game.findOne({
              _id: gameId
            });

          case 2:
            game = _context9.sent;

            if (game) {
              _context9.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 5:
            _context9.t0 = game.state;
            _context9.next = _context9.t0 === "preflop" ? 8 : _context9.t0 === "flop" ? 13 : _context9.t0 === "turn" ? 18 : _context9.t0 === "river" ? 23 : 28;
            break;

          case 8:
            _context9.next = 10;
            return models.Game.updateOne({
              _id: gameId
            }, {
              state: "flop"
            });

          case 10:
            _context9.next = 12;
            return execState("flop", gameId, models);

          case 12:
            return _context9.abrupt("break", 29);

          case 13:
            _context9.next = 15;
            return models.Game.updateOne({
              _id: gameId
            }, {
              state: "turn"
            });

          case 15:
            _context9.next = 17;
            return execState("turn", gameId, models);

          case 17:
            return _context9.abrupt("break", 29);

          case 18:
            _context9.next = 20;
            return models.Game.updateOne({
              _id: gameId
            }, {
              state: "river"
            });

          case 20:
            _context9.next = 22;
            return execState("river", gameId, models);

          case 22:
            return _context9.abrupt("break", 29);

          case 23:
            _context9.next = 25;
            return models.Game.updateOne({
              _id: gameId
            }, {
              state: "preflop"
            });

          case 25:
            _context9.next = 27;
            return execState("preflop", gameId, models);

          case 27:
            return _context9.abrupt("break", 29);

          case 28:
            throw new GameStateError('Game state is of invalid state');

          case 29:
            return _context9.abrupt("return", true);

          case 30:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function gotoNextRound(_x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();

var execState = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(state, gameId, models) {
    var players, game, dealer, bb, sb;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return models.Player.find({
              game: gameId,
              standing: false
            }).sort({
              position: 1
            });

          case 2:
            players = _context14.sent;

            if (players) {
              _context14.next = 5;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Failed to find players. Incorrect game id.');

          case 5:
            _context14.next = 7;
            return models.Game.findOne({
              _id: gameId
            });

          case 7:
            game = _context14.sent;

            if (game) {
              _context14.next = 10;
              break;
            }

            throw new _apolloServerExpress.UserInputError('Incorrect game id.');

          case 10:
            dealer = game.dealer;
            _context14.t0 = state;
            _context14.next = _context14.t0 === "preflop" ? 14 : _context14.t0 === "flop" ? 50 : _context14.t0 === "turn" ? 78 : _context14.t0 === "river" ? 104 : 130;
            break;

          case 14:
            game.deck = new _deck["default"]().shuffle();
            _context14.next = 17;
            return Promise.all(players.map( /*#__PURE__*/function () {
              var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(player) {
                var card1, card2;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        player.betAmount = -1;
                        card1 = game.deck.pop();
                        card2 = game.deck.pop();
                        player.hand = {
                          card1: card1,
                          card2: card2
                        };
                        _context10.prev = 4;
                        _context10.next = 7;
                        return player.save();

                      case 7:
                        _context10.next = 13;
                        break;

                      case 9:
                        _context10.prev = 9;
                        _context10.t0 = _context10["catch"](4);
                        console.error(_context10.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 13:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10, null, [[4, 9]]);
              }));

              return function (_x26) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 17:
            bb = players[getIndex(players, dealer, 2)];
            sb = players[getIndex(players, dealer, 1)];
            bb.stack -= game.bigBlind;
            bb.betAmount = game.bigBlind;
            sb.stack -= game.smallBlind;
            sb.betAmount = game.smallBlind;
            _context14.next = 25;
            return bb.save();

          case 25:
            _context14.next = 27;
            return sb.save();

          case 27:
            game.potSize += game.bigBlind + game.smallBlind;
            game.action = getAction(players, dealer, 3);
            game.curBet = game.bigBlind;
            game.state = "preflop";
            _context14.prev = 31;
            _context14.next = 34;
            return game.save();

          case 34:
            _context14.next = 40;
            break;

          case 36:
            _context14.prev = 36;
            _context14.t1 = _context14["catch"](31);
            console.error(_context14.t1);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 40:
            _context14.prev = 40;
            _context14.next = 43;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 43:
            _context14.next = 49;
            break;

          case 45:
            _context14.prev = 45;
            _context14.t2 = _context14["catch"](40);
            console.error(_context14.t2);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 49:
            return _context14.abrupt("break", 131);

          case 50:
            game.table.push(game.deck.pop());
            game.table.push(game.deck.pop());
            game.table.push(game.deck.pop());
            _context14.next = 55;
            return Promise.all(players.map( /*#__PURE__*/function () {
              var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(player) {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        player.betAmount = -1;
                        _context11.prev = 1;
                        _context11.next = 4;
                        return player.save();

                      case 4:
                        _context11.next = 10;
                        break;

                      case 6:
                        _context11.prev = 6;
                        _context11.t0 = _context11["catch"](1);
                        console.error(_context11.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 10:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11, null, [[1, 6]]);
              }));

              return function (_x27) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 55:
            game.action = getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;
            _context14.prev = 58;
            _context14.next = 61;
            return game.save();

          case 61:
            _context14.next = 67;
            break;

          case 63:
            _context14.prev = 63;
            _context14.t3 = _context14["catch"](58);
            console.error(_context14.t3);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 67:
            _context14.prev = 67;
            _context14.next = 70;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 70:
            _context14.next = 76;
            break;

          case 72:
            _context14.prev = 72;
            _context14.t4 = _context14["catch"](67);
            console.error(_context14.t4);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 76:
            if (game.allIn) {
              gotoNextRound(gameId, models);
            }

            return _context14.abrupt("break", 131);

          case 78:
            game.table.push(game.deck.pop());
            _context14.next = 81;
            return Promise.all(players.map( /*#__PURE__*/function () {
              var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(player) {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        player.betAmount = -1;
                        _context12.prev = 1;
                        _context12.next = 4;
                        return player.save();

                      case 4:
                        _context12.next = 10;
                        break;

                      case 6:
                        _context12.prev = 6;
                        _context12.t0 = _context12["catch"](1);
                        console.error(_context12.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 10:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, null, [[1, 6]]);
              }));

              return function (_x28) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 81:
            game.action = getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;
            _context14.prev = 84;
            _context14.next = 87;
            return game.save();

          case 87:
            _context14.next = 93;
            break;

          case 89:
            _context14.prev = 89;
            _context14.t5 = _context14["catch"](84);
            console.error(_context14.t5);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 93:
            _context14.prev = 93;
            _context14.next = 96;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 96:
            _context14.next = 102;
            break;

          case 98:
            _context14.prev = 98;
            _context14.t6 = _context14["catch"](93);
            console.error(_context14.t6);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 102:
            if (game.allIn) {
              gotoNextRound(gameId, models);
            }

            return _context14.abrupt("break", 131);

          case 104:
            game.table.push(game.deck.pop());
            _context14.next = 107;
            return Promise.all(players.map( /*#__PURE__*/function () {
              var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(player) {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        player.betAmount = -1;
                        _context13.prev = 1;
                        _context13.next = 4;
                        return player.save();

                      case 4:
                        _context13.next = 10;
                        break;

                      case 6:
                        _context13.prev = 6;
                        _context13.t0 = _context13["catch"](1);
                        console.error(_context13.t0);
                        throw new _apolloServerExpress.UserInputError('Failed to update models.');

                      case 10:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, null, [[1, 6]]);
              }));

              return function (_x29) {
                return _ref14.apply(this, arguments);
              };
            }()));

          case 107:
            game.action = getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;
            _context14.prev = 110;
            _context14.next = 113;
            return game.save();

          case 113:
            _context14.next = 119;
            break;

          case 115:
            _context14.prev = 115;
            _context14.t7 = _context14["catch"](110);
            console.error(_context14.t7);
            throw new _apolloServerExpress.UserInputError('Failed to update models.');

          case 119:
            _context14.prev = 119;
            _context14.next = 122;
            return _subscription["default"].publish(_subscription.EVENTS.PLAYER.CREATED, {
              change: game
            });

          case 122:
            _context14.next = 128;
            break;

          case 124:
            _context14.prev = 124;
            _context14.t8 = _context14["catch"](119);
            console.error(_context14.t8);
            throw new _apolloServerExpress.UserInputError('Failed to publish game.');

          case 128:
            if (game.allIn) {
              findNext(models, game.dealer, gameId, "allIn"); //this should be refactored
            }

            return _context14.abrupt("break", 131);

          case 130:
            throw new GameStateError('Game state is of invalid state');

          case 131:
            return _context14.abrupt("return", true);

          case 132:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[31, 36], [40, 45], [58, 63], [67, 72], [84, 89], [93, 98], [110, 115], [119, 124]]);
  }));

  return function execState(_x23, _x24, _x25) {
    return _ref10.apply(this, arguments);
  };
}();
//# sourceMappingURL=pokerLifeCycle.js.map