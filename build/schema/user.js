"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    extend type Query {\n        me: User\n        user(id: ID!): User\n        users: [User!]\n    }\n\n    extend type Mutation {\n        signUp(\n            username: String!\n            password: String!\n            venmo: String\n        ): Token!\n        signIn(\n            username: String!\n            password: String!\n        ): Token!\n        deleteUser(id: ID!): Boolean!\n    }\n\n    type User {\n        id: ID!\n        username: String!\n        venmo: String\n        role: String\n    \n        player: Player!\n    }\n\n    type Token {\n        token: String!\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = (0, _apolloServerExpress.gql)(_templateObject());

exports["default"] = _default;
//# sourceMappingURL=user.js.map