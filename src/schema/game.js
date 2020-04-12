import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        game(id: ID!): Game
        getData(gameId: ID!): Boolean!
    }

    extend type Mutation {
        createGame(
            sBlind: Int!,
            bBlind: Int!,
        ): ID!
        joinGame(
            gameId: ID!
        ): Boolean!
        startGame(gameId: ID!): Boolean!

        bet(amount: Int!, gameId: ID!): Boolean!
        fold(gameId: ID!): Boolean!
        allIn(gameId: ID!): Boolean!
    }

    extend type Subscription {
        change(gameId: ID!): Game
    }

    type Game {
        id: ID!
        smallBlind: Int!
        bigBlind: Int!
        potSize: Int!
        dealer: Int!
        numPlayers: Int!
        table: [Card]
        state: String 
        curBet: Int
        winner: Int

        action: Int
        players: [Player!]
    }

    type Card {
        number: String
        suit: String
    }
`;

//get rid of position for bet, fold, and allin in actual
//implementation.

//can make card number and suit enums in the future

//state should be an enum of {preflop, flop, turn, river}