"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    extend type Query {\n        player(position: Int!, gameId: ID!): Player\n        players: [Player!]\n    }\n\n    extend type Mutation {\n        createPlayer(\n            stack: Int!\n            position: Int!\n            gameId: ID!\n        ): Boolean!\n        updateStack(\n            position: Int!\n            stack: Int!\n            gameId: ID!\n        ): Boolean!\n        removePlayer(\n            position: Int!\n            gameId: ID!\n        ): Boolean!\n\n        player(position: Int!, gameId: ID!): Player\n        sit(position: Int!, gameId: ID!): Boolean!\n        stand(position: Int!, gameId: ID!): Boolean!\n    }\n\n    type Player {\n        id: ID!\n        stack: Int!\n        position: Int!\n        betAmount: Int\n        isFolded: Boolean\n        isAllIn: Boolean\n        hand: Hand\n        showCards: Hand\n        admin: Boolean\n\n        user: User\n        game: Game\n    }\n\n    type Hand {\n        card1: Card!\n        card2: Card!\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = (0, _apolloServerExpress.gql)(_templateObject());

exports["default"] = _default;
//# sourceMappingURL=player.js.map