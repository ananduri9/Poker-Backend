import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        player(position: Int!, gameId: ID!): Player
        players: [Player!]
    }

    extend type Mutation {
        createPlayer(
            stack: Int!
            position: Int!
            gameId: ID!
        ): Boolean!
        addToStack(
            position: Int!
            amount: Int!
            gameId: ID!
        ): Boolean!
        removePlayer(
            position: Int!
            gameId: ID!
        ): Boolean!

        player(position: Int!, gameId: ID!): Player
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
        standing: Boolean
        admin: Boolean

        user: User
        game: Game
    }

    type Hand {
        card1: Card
        card2: Card
    }
`
