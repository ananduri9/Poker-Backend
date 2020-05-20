import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        game(id: ID!): Game
        getData(gameId: ID!): Boolean!
    }

    extend type Mutation {
        createGame(
            sBlind: Int!,
            bBlind: Int!,
            timer: Int,
        ): ID!
        joinGame(
            gameId: ID!
        ): Boolean!
        startGame(gameId: ID!): Boolean!

        bet(amount: Int!, gameId: ID!): Boolean!
        fold(gameId: ID!): Boolean!
        allIn(gameId: ID!): Boolean!

        showCards(gameId: ID!): Boolean!
        updateTimer(gameId: ID!, timer: Int!): Boolean!

        sit(gameId: ID!): Boolean!
        stand(gameId: ID!): Boolean!
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
        raise: Int
        winners: [Int]

        sidePots: [sidePot]
        action: Int
        players: [Player!]
    }

    type sidePot {
        value: Int
        positions: [Int]
    }

    type Card {
        value: String
        suit: String
    }
`
