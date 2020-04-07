"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _user = _interopRequireDefault(require("./user"));

var _game = _interopRequireDefault(require("./game"));

var _player = _interopRequireDefault(require("./player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type Query {\n        _: Boolean         \n    }\n\n    type Mutation {\n        _: Boolean   \n    }\n\n    type Subscription {\n        _: Boolean\n    } \n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var linkSchema = (0, _apolloServerExpress.gql)(_templateObject());
var _default = [linkSchema, _user["default"], _game["default"], _player["default"]];
exports["default"] = _default;
//# sourceMappingURL=index.js.map