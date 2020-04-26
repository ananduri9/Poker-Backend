import { gql } from 'apollo-server-express'

import userSchema from './user'
import gameSchema from './game'
import playerSchema from './player'

const linkSchema = gql`
    type Query {
        _: Boolean         
    }

    type Mutation {
        _: Boolean   
    }

    type Subscription {
        _: Boolean
    } 
`

export default [linkSchema, userSchema, gameSchema, playerSchema]
