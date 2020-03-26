import { gql } from 'apollo-server-express';

export default gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]

        player(id: ID!): Player
        players: [Player!]

        game(id: ID!): Game
    }

    type Mutation {
        signUp(
            username: String!
            password: String!
            venmo: String
        ): Token!
        signIn(username: String!, password: String!): Token!
        deleteUser(id: ID!): Boolean!

        createPlayer(stack: Int!, position: Int!, gameId: ID!): Boolean!
        updateStack(position: Int!, stack: Int!, gameId: ID!): Boolean!
        removePlayer(position: Int!, gameId: ID!): Boolean!
        bet(position: Int!, amount: Int!, gameId: ID!): Boolean!
        fold(position: Int!, gameId: ID!): Boolean!

        createNewGame(
            sBlind: Int!,
            bBlind: Int!,
        ): ID!

        startGame(gameId: ID!): Boolean! 
    }

    type Subscription {
        change(gameId: ID!): Event!
    }

    type Event {
        gameState: Game!
    }

    type Token {
        token: String!
    }

    type Game {
        id: ID!
        potSize: Int!
        dealer: Int!
        smallBlind: Int!
        bigBlind: Int!
        numPlayers: Int!
        table: [Card]
        state: String
        curBet: Int
        action: Int

        players: [Player!]
    }

    type User {
        id: ID!
        username: String!
        venmo: String
        role: String

        player: Player!
    }

    type Player {
        id: ID!
        stack: Int!
        hand: Hand
        betAmount: Int
        isFolded: Boolean
        position: Int!

        user: User
        game: Game
    }

    type Hand {
        card1: Card!
        card2: Card!
    }

    type Card {
        number: String!
        suit: String!
    }
`;

//can make card number and suit enums in the future

//state should be an enum of {preflop, flop, turn, river}