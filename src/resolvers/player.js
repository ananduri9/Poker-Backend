import { UserInputError } from 'apollo-server-express'

import pubsub, { EVENTS } from '../subscription'
import { removePlayer } from '../helpers/functions'

export default {
  Query: {
    player: async (parent, { position, gameId }, { models }) => {
      const player = await models.Player.findOne({ position: position, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player. Incorrect position or game id.')
      }
      return player
    }
  },

  Mutation: {
    createPlayer: async (
      parent,
      { stack, position, gameId },
      { me, models }
    ) => {
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }

      if (stack <= 0) {
        throw new UserInputError('Invalid amount for stack.')
      }

      let admin = false
      if (game.numPlayers === 0) {
        admin = true
      }

      // If game already started, make standing and sit them next round
      let standing = false
      let requestSitting = false
      if (game.state !== 'notStarted') {
        standing = true
        requestSitting = true
      }

      const player = new models.Player({
        stack: stack,
        position: position,
        hand: null,
        betAmount: -1,
        standing: standing,
        requestStanding: false,
        requestSitting: requestSitting,
        admin: admin,

        game: gameId,
        user: me.id
      })
      if (!player) {
        throw new UserInputError('Failed to create new player.')
      }
      game.numPlayers += 1

      user.player = player.id
      game.players.push(player)

      try {
        await user.save()
        await game.save()
        await player.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to publish game.')
      }

      return true
    },

    addToStack: async ( // is me
      parent,
      { position, amount, gameId },
      { models }
    ) => {
      const player = await models.Player.findOne({ position: position, game: gameId })
      if (!player) {
        throw new UserInputError('Incorrect game id or position.')
      }

      if (amount <= 0) {
        throw new UserInputError('Invalid amount for addition to stack.')
      }

      player.addToStack = amount

      try {
        await player.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      return true
    },

    removePlayer: async ( // should be player admin
      parent,
      { position, gameId },
      { models }
    ) => {
      return await removePlayer(position, gameId, models)
    },

    player: async (parent, { position, gameId }, { models }) => {
      const player = await models.Player.findOne({ position: position, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player. Incorrect position or game id.')
      }
      return player
    }
  },

  Player: {
    user: async (player, args, { models }) => {
      const user = await models.User.findOne({
        player: player.id
      })

      if (!user) {
        throw new Error('Failed to find valid user by player id.')
      }

      return user
    },
    game: async (player, args, { models }) => {
      const game = await models.Game.findOne({
        player: player.id
      })

      if (!game) {
        throw new Error('Failed to find valid game by player id.')
      }

      return game
    }
  }
}
