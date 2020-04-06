import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        player(position: Int!, gamedId: ID!): Player
        players: [Player!]
    }

    extend type Mutation {
        createPlayer(
            stack: Int!
            position: Int!
            gameId: ID!
        ): Boolean!
        updateStack(
            position: Int!
            stack: Int!
            gameId: ID!
        ): Boolean!
        removePlayer(
            position: Int!
            gameId: ID!
        ): Boolean!
        sit(position: Int!, gameId: ID!): Boolean!
        stand(position: Int!, gameId: ID!): Boolean!
    }

    type Player {
        id: ID!
        stack: Int!
        position: Int!
        betAmount: Int
        isFolded: Boolean
        isAllIn: Boolean
        hand: Hand
        showCards: Hand
        admin: Boolean

        user: User
        game: Game
    }

    type Hand {
        card1: Card!
        card2: Card!
    }
`