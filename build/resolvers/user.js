"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _apolloServerExpress = require("apollo-server-express");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, secret) {
    var id, username, role, player;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = user.id, username = user.username, role = user.role, player = user.player;
            return _context.abrupt("return", _jsonwebtoken["default"].sign({
              id: id,
              username: username,
              role: role,
              player: player
            }, secret));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createToken(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var generatePasswordHash = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(password) {
    var saltRounds;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            saltRounds = 10;
            _context2.next = 3;
            return _bcrypt["default"].hash(password, saltRounds);

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function generatePasswordHash(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  Query: {
    me: function () {
      var _me2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref3) {
        var _me, models;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _me = _ref3.me, models = _ref3.models;

                if (_me) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", null);

              case 3:
                _context3.next = 5;
                return models.User.findOne({
                  _id: _me.id
                });

              case 5:
                return _context3.abrupt("return", _context3.sent);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function me(_x4, _x5, _x6) {
        return _me2.apply(this, arguments);
      }

      return me;
    }(),
    user: function () {
      var _user = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, _ref4, _ref5) {
        var id, models;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = _ref4.id;
                models = _ref5.models;
                _context4.next = 4;
                return models.User.findOne({
                  _id: id
                });

              case 4:
                return _context4.abrupt("return", _context4.sent);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function user(_x7, _x8, _x9) {
        return _user.apply(this, arguments);
      }

      return user;
    }(),
    users: function () {
      var _users = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref6) {
        var models;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                models = _ref6.models;
                _context5.next = 3;
                return models.User.find({});

              case 3:
                return _context5.abrupt("return", _context5.sent);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function users(_x10, _x11, _x12) {
        return _users.apply(this, arguments);
      }

      return users;
    }()
  },
  Mutation: {
    signUp: function () {
      var _signUp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, _ref7, _ref8) {
        var username, password, venmo, models, secret, role, user;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                username = _ref7.username, password = _ref7.password, venmo = _ref7.venmo;
                models = _ref8.models, secret = _ref8.secret;
                // Allow for admin users - fix this later!
                role = null;

                if (username === "ananduri" || username === "jmay") {
                  role = 'ADMIN';
                }

                _context6.t0 = models.User;
                _context6.t1 = username;
                _context6.next = 8;
                return generatePasswordHash(password);

              case 8:
                _context6.t2 = _context6.sent;
                _context6.t3 = venmo;
                _context6.t4 = {
                  username: _context6.t1,
                  password: _context6.t2,
                  venmo: _context6.t3
                };
                _context6.next = 13;
                return new _context6.t0(_context6.t4);

              case 13:
                user = _context6.sent;

                if (user) {
                  _context6.next = 16;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('Sign up failed.');

              case 16:
                _context6.prev = 16;
                _context6.next = 19;
                return user.save();

              case 19:
                _context6.next = 25;
                break;

              case 21:
                _context6.prev = 21;
                _context6.t5 = _context6["catch"](16);
                console.error(_context6.t5);
                throw new _apolloServerExpress.UserInputError('Failed to update models.');

              case 25:
                return _context6.abrupt("return", {
                  token: createToken(user, secret)
                });

              case 26:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[16, 21]]);
      }));

      function signUp(_x13, _x14, _x15) {
        return _signUp.apply(this, arguments);
      }

      return signUp;
    }(),
    signIn: function () {
      var _signIn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parent, _ref9, _ref10) {
        var username, password, models, secret, user, isValid;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                username = _ref9.username, password = _ref9.password;
                models = _ref10.models, secret = _ref10.secret;
                _context7.next = 4;
                return models.User.findByLogin(username);

              case 4:
                user = _context7.sent;

                if (user) {
                  _context7.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError('No user found with this login credentials.');

              case 7:
                _context7.next = 9;
                return user.validatePassword(password);

              case 9:
                isValid = _context7.sent;

                if (isValid) {
                  _context7.next = 12;
                  break;
                }

                throw new AuthenticationError('Invalid password.');

              case 12:
                return _context7.abrupt("return", {
                  token: createToken(user, secret)
                });

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function signIn(_x16, _x17, _x18) {
        return _signIn.apply(this, arguments);
      }

      return signIn;
    }(),
    deleteUser: function () {
      var _deleteUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, _ref11, _ref12) {
        var id, models;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                id = _ref11.id;
                models = _ref12.models;
                _context8.prev = 2;
                _context8.next = 5;
                return models.User.findOneAndRemove({
                  _id: id
                });

              case 5:
                _context8.next = 11;
                break;

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8["catch"](2);
                console.error(_context8.t0);
                throw new _apolloServerExpress.UserInputError('Failed to delete user');

              case 11:
                return _context8.abrupt("return", true);

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[2, 7]]);
      }));

      function deleteUser(_x19, _x20, _x21) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  },
  User: {
    player: function () {
      var _player = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(user, args, _ref13) {
        var models, player;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                models = _ref13.models;
                _context9.next = 3;
                return models.Player.findOne({
                  user: user.id
                });

              case 3:
                player = _context9.sent;

                if (player) {
                  _context9.next = 6;
                  break;
                }

                throw new ServerError('Failed to find valid player by user id.');

              case 6:
                return _context9.abrupt("return", player);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function player(_x22, _x23, _x24) {
        return _player.apply(this, arguments);
      }

      return player;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=user.js.map