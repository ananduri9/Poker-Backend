import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        me: User
        user(id: ID!): User
        users: [User!]
    }

    extend type Mutation {
        signUp(
            username: String!
            password: String!
            venmo: String
        ): Token!
        signIn(
            username: String!
            password: String!
        ): Token!
        deleteUser(id: ID!): Boolean!
    }

    type User {
        id: ID!
        username: String!
        venmo: String
        role: String
    
        player: Player!
    }

    type Token {
        token: String!
    }
`
