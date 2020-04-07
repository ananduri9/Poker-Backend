"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    extend type Query {\n        game(id: ID!): Game\n        getData(gameId: ID!): Boolean!\n    }\n\n    extend type Mutation {\n        createGame(\n            sBlind: Int!,\n            bBlind: Int!,\n        ): ID!\n        joinGame(\n            gameId: ID!\n        ): Boolean!\n        startGame(gameId: ID!): Boolean!\n\n        bet(amount: Int!, gameId: ID!): Boolean!\n        fold(gameId: ID!): Boolean!\n        allIn(gameId: ID!): Boolean!\n    }\n\n    extend type Subscription {\n        change(gameId: ID!): Game\n    }\n\n    type Game {\n        id: ID!\n        smallBlind: Int!\n        bigBlind: Int!\n        potSize: Int!\n        dealer: Int!\n        numPlayers: Int!\n        table: [Card]\n        state: String \n        curBet: Int\n\n        action: Int\n        players: [Player!]\n    }\n\n    type Card {\n        number: String!\n        suit: String!\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = (0, _apolloServerExpress.gql)(_templateObject()); //get rid of position for bet, fold, and allin in actual
//implementation.
//can make card number and suit enums in the future
//state should be an enum of {preflop, flop, turn, river}


exports["default"] = _default;
//# sourceMappingURL=game.js.map