"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.isAuthenticated = void 0;

var _apolloServer = require("apollo-server");

var _graphqlResolvers = require("graphql-resolvers");

var isAuthenticated = function isAuthenticated(parent, args, _ref) {
  var me = _ref.me;
  return me ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError('Not authenticated as user.');
};

exports.isAuthenticated = isAuthenticated;
var isAdmin = (0, _graphqlResolvers.combineResolvers)(isAuthenticated, function (parent, args, _ref2) {
  var role = _ref2.me.role;
  return role === 'ADMIN' ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError('Not authorized as admin');
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=authorization.js.map