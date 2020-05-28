
import { withFilter } from 'apollo-server'
import { UserInputError } from 'apollo-server-express'

import pubsub, { EVENTS } from '../subscription'
import { startNewHand, findNext } from '../helpers/pokerLifeCycle'

export default {
  Query: {
    game: async (parent, { id }, { models }) => {
      const game = models.Game.findOne({ _id: id })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }
      return game
    },

    getData: async (
      parent,
      { gameId },
      { models }
    ) => {
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
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
    }
  },

  Mutation: {
    createGame: async (
      parent,
      { sBlind, bBlind },
      { models }
    ) => {
      const game = new models.Game({
        potSize: 0,
        smallBlind: sBlind,
        bigBlind: bBlind,
        dealer: 0,
        numPlayers: 0,
        table: [],
        prevPotSize: 0,
        state: 'notStarted',
        winners: [],
        timer: 45
      })
      if (!game) {
        throw new UserInputError('Failed to create new game.')
      }

      if (sBlind > bBlind) {
        throw new UserInputError('Small blind must be smaller than big blind.')
      }

      try {
        await game.save()
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

      return game.id
    },

    joinGame: async ( // For establishing link to subscription
      parent,
      { gameId },
      { models }
    ) => {
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
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

    startGame: async ( // game should be in not started state
      parent,
      { gameId },
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
      const player = await models.Player.findOne({ _id: user.player, game: gameId, standing: false })
      if (!user) {
        throw new UserInputError('Failed to find valid player.')
      }

      game.dealer = player.position

      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      await startNewHand(gameId, models)
      return true
    },

    bet: async ( // me player should match player with action
      parent,
      { position, amount, gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      clearTimeout(game.timeoutObj)

      if (amount < 0) {
        throw new UserInputError('Cannot bet less than 0.')
      }

      if (amount > (player.betAmount < 0 ? 0 : player.betAmount) + player.stack) {
        throw new UserInputError('Cannot bet more than your stack.')
      }

      if (amount < game.curBet) {
        throw new UserInputError('Bet must be at least as much as current bet.')
      }

      let increase
      let curRaise

      if (player.betAmount === -1) {
        increase = amount
        player.betAmount = amount
      } else {
        increase = amount - player.betAmount
        player.betAmount = amount
      }

      if (amount > game.curBet) {
        curRaise = amount - game.curBet
      } else {
        curRaise = 0
      }

      // Throw error if player tries to raise by less than min raise
      if (curRaise > 0 && curRaise < game.raise) {
        throw new UserInputError(`Must raise by at least the minimum raise of ${game.raise}`)
      }

      // Set min raise to new raise amount, if there is a raise
      if (curRaise) {
        game.raise = curRaise
      }

      player.stack -= increase
      game.potSize += increase
      game.curBet = player.betAmount

      try {
        await player.save()
        await game.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      findNext(models, player.position, gameId, 'bet')
      return true
    },

    allIn: async ( // me player should match player with action
      parent,
      { position, gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      clearTimeout(game.timeoutObj)

      if (player.betAmount === -1) {
        player.betAmount = player.stack
      } else {
        player.betAmount += player.stack
      }

      // If all in is a raise, adjust the game's min raise value
      let curRaise
      if (player.stack > game.curBet) {
        curRaise = player.stack - game.curBet
      } else {
        curRaise = 0
      }

      if (curRaise) {
        game.raise = Math.max(curRaise, game.raise)
      }

      game.curBet = Math.max(player.betAmount, game.curBet)
      game.potSize += player.stack
      game.handleAllIn = true

      player.isAllIn = true
      player.stack = 0

      try {
        await player.save()
        await game.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      findNext(models, player.position, gameId, 'allIn')
      return true
    },

    fold: async ( // me player should match player with action
      parent,
      { position, gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      clearTimeout(game.timeoutObj)

      player.isFolded = true

      try {
        await player.save()
        await game.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      findNext(models, player.position, gameId, 'fold')
      return true
    },

    showCards: async ( // is me
      parent,
      { postion, gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      player.showCards = player.hand

      try {
        await player.save()
        await game.save()
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

    updateTimer: async ( // only changeable by admin player
      parent,
      { gameId, timer },
      { me, models }
    ) => {
      const game = await models.Game.findOne({ _id: gameId })
      if (!game) {
        throw new UserInputError('Incorrect game id.')
      }

      game.timer = timer

      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      return true
    },

    sit: async ( // is me
      parent,
      { gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }

      player.requestSitting = true

      try {
        await player.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      return true
    },

    stand: async ( // is me
      parent,
      { gameId },
      { me, models }
    ) => {
      const user = await models.User.findOne({ _id: me.id })
      if (!user) {
        throw new UserInputError('Failed to find valid user.')
      }
      const player = await models.Player.findOne({ _id: user.player, game: gameId })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }

      player.requestStanding = true

      try {
        await player.save()
      } catch (err) {
        console.error(err)
        throw new UserInputError('Failed to update models.')
      }

      return true
    }
  },

  Subscription: {
    change: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.PLAYER.CREATED),
        (payload, variables) => {
          return variables.gameId === payload.change.id
        }
      )
    }
  },

  Game: {
    players: async (game, args, { models }) => {
      const player = await models.Player.find({
        game: game.id,
        standing: false
      })
      if (!player) {
        throw new UserInputError('Failed to find player user.')
      }

      return player
    }
  }
}
