"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/stable");

require("regenerator-runtime/runtime");

require("dotenv/config");

var _cors = _interopRequireDefault(require("cors"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./schema"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _models = _interopRequireWildcard(require("./models"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _express["default"])();
app.use((0, _cors["default"])());

var getMe = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers.authorization;

            if (!token) {
              _context.next = 9;
              break;
            }

            _context.prev = 2;
            return _context.abrupt("return", _jsonwebtoken["default"].verify(token, process.env.SECRET));

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](2);
            throw new _apolloServerExpress.AuthenticationError('Your session expired. Sign in again.');

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 6]]);
  }));

  return function getMe(_x) {
    return _ref.apply(this, arguments);
  };
}();

var server = new _apolloServerExpress.ApolloServer({
  typeDefs: _schema["default"],
  resolvers: _resolvers["default"],
  context: function () {
    var _context2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref2) {
      var req, connection, me;
      return regeneratorRuntime.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              req = _ref2.req, connection = _ref2.connection;

              if (!connection) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", {
                models: _models["default"]
              });

            case 3:
              if (!req) {
                _context3.next = 8;
                break;
              }

              _context3.next = 6;
              return getMe(req);

            case 6:
              me = _context3.sent;
              return _context3.abrupt("return", {
                models: _models["default"],
                me: me,
                secret: process.env.SECRET
              });

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee2);
    }));

    function context(_x2) {
      return _context2.apply(this, arguments);
    }

    return context;
  }()
});
server.applyMiddleware({
  app: app,
  path: '/graphql'
});

var httpServer = _http["default"].createServer(app);

server.installSubscriptionHandlers(httpServer);
var eraseDatabaseOnSync = false;
var port = process.env.PORT || 8000;
(0, _models.connectDb)().then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
  return regeneratorRuntime.wrap(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!eraseDatabaseOnSync) {
            _context4.next = 3;
            break;
          }

          _context4.next = 3;
          return Promise.all([_models["default"].User.deleteMany({}), _models["default"].Player.deleteMany({}), _models["default"].Game.deleteMany({})]);

        case 3:
          httpServer.listen({
            port: port
          }, function () {
            console.log("Apollo Server on http://localhost:".concat(port, "/graphql"));
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee3);
})));
//# sourceMappingURL=index.js.map