import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server-express'
import { combineResolvers } from 'graphql-resolvers'
import bcrypt from 'bcrypt'

import { isAdmin } from './authorization'

const createToken = async (user, secret) => {
  const { id, username, role, player } = user
  return jwt.sign({ id, username, role, player }, secret)
}

const generatePasswordHash = async function (password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export default {
  Query: {
    me: async (parent, args, { me, models }) => {
      if (!me) {
        return null
      }
      return await models.User.findOne({ _id: me.id })
    },

    user: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.findOne({ _id: id })
      }
    ),

    users: combineResolvers(
      isAdmin,
      async (parent, args, { models }) => {
        return await models.User.find({})
      }
    )
  },

  Mutation: {
    signUp: async (
      parent,
      { username, password, venmo },
      { models, secret }
    ) => {
      let role
      if (username === 'ananduri' || username === 'jmay') {
        role = 'ADMIN'
      }

      const user = await new models.User({
        username,
        password: await generatePasswordHash(password),
        venmo,
        role
      })
      if (!user) {
        throw new UserInputError('Sign up failed.')
      }

      try {
        await user.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      return { token: createToken(user, secret) }
    },

    signIn: async (
      parent,
      { username, password },
      { models, secret }
    ) => {
      const user = await models.User.findByLogin(username)
      if (!user) {
        throw new UserInputError('No user found with this login credentials.')
      }

      const isValid = await user.validatePassword(password)
      if (!isValid) {
        throw new Error('Invalid password.')
      }

      return { token: createToken(user, secret) }
    },

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        try {
          await models.User.findOneAndRemove({ _id: id })
        } catch (err) {
          console.error(err)
          throw new UserInputError('Failed to delete user')
        }
        return true
      }
    )
  },

  User: {
    player: async (user, args, { models }) => {
      const player = await models.Player.findOne({
        user: user.id
      })

      if (!player) {
        throw new Error('Failed to find valid player by user id.')
      }

      return player
    }
  }
}
