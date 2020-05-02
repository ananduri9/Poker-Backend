import { Hand } from 'pokersolver'
import { UserInputError } from 'apollo-server-express'

import pubsub, { EVENTS } from '../subscription'
import Deck from './deck'
import { removePlayer } from './functions'
import { snooze } from './utils'

const getAction = (players, curPos, numNext) => {
  const livePlayers = players.filter(player => {
    return (!player.isFolded && !player.isAllIn)
  })

  return getPosition(livePlayers, curPos, numNext)
}

const getPosition = (players, curPos, numNext) => {
  const nextIndex = getIndex(players, curPos, numNext)
  return players[nextIndex].position
}

const getIndex = (players, curPos, numNext) => {
  const curIndex = players.map(player => player.position).indexOf(curPos)
  return (curIndex + numNext) % players.length
}

const handleAllIns = async (gameId, models) => {
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }
  const players = await models.Player.find({ game: gameId, standing: false }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }
  console.log('players')
  console.log(players)

  const playersAlive = players.filter(player => (!player.isFolded && !players.handleAllIn))
  const playersAllIn = playersAlive.filter(player => (player.isAllIn && !players.handleAllIn))

  console.log('playersAlive')
  console.log(playersAlive)
  console.log('playersAllIn')
  console.log(playersAllIn)

  playersAlive.sort((a, b) => { // Sort alive playersin ascending order of bet amount or stack size
    if (a.stack - b.stack === 0) {
      return a.betAmount - b.betAmount
    } else {
      return a.stack - b.stack
    }
  })

  const len = playersAlive.length

  if (playersAlive.length === playersAllIn.length) {
    // Person with biggest stack is all in no more
    playersAlive[len - 1].isAllIn = false
    playersAlive[len - 1].stack = playersAlive[len - 1].betAmount - playersAlive[len - 2].betAmount
    playersAlive[len - 1].betAmount = playersAlive[len - 1].betAmount - playersAlive[len - 1].stack
    game.potSize -= playersAlive[len - 1].stack
  }

  let numRegular = 0
  playersAlive.forEach(player => {
    if (!player.isAllIn) {
      numRegular += 1
    } else {
      player.handleAllIn = true
    }
  })

  console.log('numRegular')
  console.log(numRegular)

  if (numRegular === 1) {
    game.allIn = true // Proceed all the way to show down and show cards
    playersAlive.forEach(player => {
      player.showCards = player.hand
    })
  }

  let prevBetAmount = 0
  console.log('playersAlive')
  console.log(playersAlive)
  // Create side pots and push onto game stack
  let index = 0
  for (const player of playersAlive) {
    if (player.isAllIn) {
      const sidePotSize = (player.betAmount - prevBetAmount) * (len - index) + game.prevPotSize // shaky logic?
      game.sidePot.push({
        size: sidePotSize,
        positions: playersAlive.slice(index).map(player => player.position)
      })
      console.log('sidepot')
      console.log(game.sidePot)
      game.potSize -= sidePotSize
      console.log('potsize')
      console.log(game.potSize)
      prevBetAmount += player.betAmount
      game.prevPotSize = 0
    }
    index += 1
  };

  await Promise.all(playersAlive.map(async (player) => {
    try {
      await player.save()
    } catch (err) {
      console.error(err)
      throw new Error('Failed to update models.')
    }
  }))

  game.handleAllIn = false
  try {
    await game.save()
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update models.')
  }

  return game
}

const isBigBlindDuringPreflop = (game, players, index) => {
  return (game.state === 'preflop' &&
           index === getIndex(players, game.dealer, 2) &&
           game.curBet === game.bigBlind)
}

const findNext = async (models, startPos, gameId, act) => {
  let game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }
  const players = await models.Player.find({ game: gameId, standing: false }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }

  let alive = 0
  let aliveIndex
  for (let i = 1; i < players.length; i++) {
    const index = getIndex(players, startPos, i)
    if (!players[index].isFolded) {
      alive += 1 // Keep track of number not folded
      aliveIndex = index // Keep track of last person alive
    }
  }

  // If everyone else is folded, this person wins
  if (act === 'fold' && alive === 1) {
    await wins(game.potSize, players[aliveIndex].position, gameId, models, 1)
    // await foldLosers(gameId, models)

    try {
      await pubsub.publish(EVENTS.PLAYER.CREATED, {
        change: game
      })
    } catch (err) {
      console.error(err)
      throw new Error('Failed to publish game.')
    }

    await snooze(6000)

    await startNewHand(gameId, models)
    return true
  }

  // Check if there is another person to act in this round
  for (let i = 1; i < players.length; i++) {
    const index = getIndex(players, startPos, i)

    if (!players[index].isFolded && !players[index].isAllIn) {
      if ((players[index].betAmount !== game.curBet) || isBigBlindDuringPreflop(game, players, index)) {
        game.action = players[index].position // Set action to next player to act
        try {
          await game.save()
        } catch (err) {
          console.error(err)
          throw new Error('Failed to update models.')
        }

        try {
          await pubsub.publish(EVENTS.PLAYER.CREATED, {
            change: game
          })
        } catch (err) {
          console.error(err)
          throw new Error('Failed to publish game.')
        }

        return true
      }
    }
  }

  if (alive > 0) {
    // Handle any all ins called in this round
    if (game.handleAllIn) {
      game = await handleAllIns(gameId, models)

      await pubsub.publish(EVENTS.PLAYER.CREATED, {
        change: game
      })
    }

    // Handle showdowns at river
    if (game.state === 'river') {
      const showDownplayers = players.filter(player => {
        return ((!player.isAllIn && !player.isFolded && player.betAmount === game.curBet))
      })
      const showDownpositions = showDownplayers.map(player => player.position)

      // Handle all in side pots
      for (const sidePot of game.sidePot) {
        console.log('sidepot2')
        console.log(sidePot)
        const { size, positions } = sidePot
        console.log('size')
        console.log(size)
        console.log('positions')
        console.log(positions)
        await showdown(size, positions, gameId, models)
        console.log(game.potSize)
      }

      // Handle normal showdown between >= 2 players
      console.log(showDownpositions)
      if (showDownplayers.length > 1) {
        await showdown(game.potSize, showDownpositions, gameId, models)
      }

      // await foldLosers(gameId, models)

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new Error('Failed to publish game.')
      }

      console.log('About to snooze without halting the event loop...')
      await snooze(6000)
      console.log('done!')

      // Start new hand from beginning
      await startNewHand(gameId, models)
      return true
    }

    // Else if not river, go to next round
    await gotoNextRound(gameId, models)
    return true
  }

  // Should not reach here
  throw new Error('Error, there are no live players!')
}

const showdown = async (potSize, positions, gameId, models) => {
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }
  const players = await models.Player.find({
    position: { $in: positions },
    standing: false,
    isFolded: false,
    game: gameId
  }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }

  const tableCards = game.table.map(card => {
    return card.value + card.suit
  })
  console.log(tableCards)
  console.log(players)

  const playerHands = players.map(player => {
    console.log(player.hand)
    const card1 = player.hand.card1.value + player.hand.card1.suit
    const card2 = player.hand.card2.value + player.hand.card2.suit
    return [card1, card2, ...tableCards]
  })

  players.forEach((player, index) => {
    player.fullHand = playerHands[index]
  })

  const solvedHands = playerHands.map(hand => Hand.solve(hand))
  const winningCards = Hand.winners(solvedHands)
  const numWinners = winningCards.length

  await Promise.all(winningCards.map(async (cards) => {
    const winners = cards.cardPool.map(card => card.value + card.suit)
    const winner = players.find(player => {
      return JSON.stringify(player.fullHand.sort()) === JSON.stringify(winners.sort())
    })

    console.log('alo')
    console.log(winner.fullHand)
    winner.showCards = winner.hand

    try {
      await winner.save()
    } catch (err) {
      console.error(err)
      throw new Error('Failed to update models.')
    }

    await wins(potSize, winner.position, gameId, models, numWinners)
  }))

  return true
}

const wins = async (potSize, position, gameId, models, numWinners) => {
  const player = await models.Player.findOne({ position: position, game: gameId })
  if (!player) {
    throw new UserInputError('Failed to find player. Invalid position.')
  }
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }

  console.log('position of winner')
  console.log(position)
  console.log(potSize)

  game.winners.push(position)

  player.stack += Math.floor(potSize / numWinners)

  try {
    await player.save()
    await game.save()
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update models.')
  }
  return true
}

const foldLosers = async (gameId, models) => {
  const players = await models.Player.find({ game: gameId }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }

  await Promise.all(players.map(async (player) => {
    if (!(player.position in game.s)) {
      player.isFolded = true
    }
    try {
      await player.save()
    } catch (err) {
      console.error(err)
      throw new Error('Failed to update models.')
    }
  }))
}

const startNewHand = async (gameId, models) => {
  const players = await models.Player.find({ game: gameId }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }

  game.deck = (new Deck()).shuffle()

  await Promise.all(players.map(async (player) => {
    if (player.requestStanding) {
      player.standing = true
    }
    if (player.requestSitting) {
      player.standing = false
    }
    player.isFolded = false
    player.isAllIn = false
    player.handleAllIn = false
    player.hand = null
    player.showCards = null
    player.betAmount = -1
    const card1 = game.deck.pop()
    const card2 = game.deck.pop()
    player.hand = { card1: card1, card2: card2 }
    try {
      await player.save()
    } catch (err) {
      console.error(err)
      throw new Error('Failed to update models.')
    }
  }))

  // Remove player if stack went to 0 - make player standing if stack goes to 0
  for (const player of players) {
    if (player.stack <= 0) {
      await removePlayer(player.position, gameId, models)
    }
  }

  game.potSize = 0
  game.sidePot = []
  game.allIn = false
  game.handleAllIn = false
  game.dealer = getPosition(players, game.dealer, 1)
  game.table = []
  game.state = 'newRound'
  game.curBet = -1
  game.prevPotSize = 0
  game.winners = []

  try {
    await game.save()
  } catch (err) {
    console.error(err)
    throw new Error('Failed to update models.')
  }

  try {
    await pubsub.publish(EVENTS.PLAYER.CREATED, {
      change: game
    })
  } catch (err) {
    console.error(err)
    throw new Error('Failed to publish game.')
  }

  await gotoNextRound(gameId, models)
  return true
}

const gotoNextRound = async (gameId, models) => {
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }

  switch (game.state) {
    case 'newRound':
      await models.Game.updateOne(
        { _id: gameId },
        {
          state: 'preflop'
        }
      )
      await execState('preflop', gameId, models)
      break
    case 'preflop':
      await models.Game.updateOne(
        { _id: gameId },
        {
          state: 'flop'
        }
      )
      await execState('flop', gameId, models)
      break
    case 'flop':
      await models.Game.updateOne(
        { _id: gameId },
        {
          state: 'turn'
        }
      )
      await execState('turn', gameId, models)
      break
    case 'turn':
      await models.Game.updateOne(
        { _id: gameId },
        {
          state: 'river'
        }
      )
      await execState('river', gameId, models)
      break
    case 'river':
      await models.Game.updateOne(
        { _id: gameId },
        {
          state: 'preflop'
        }
      )
      await execState('preflop', gameId, models)
      break
    default:
      throw new Error('Game state is of invalid state')
  }
  return true
}

const execState = async (state, gameId, models) => {
  const players = await models.Player.find({ game: gameId, standing: false }).sort({ position: 1 })
  if (!players) {
    throw new UserInputError('Failed to find players. Incorrect game id.')
  }
  const game = await models.Game.findOne({ _id: gameId })
  if (!game) {
    throw new UserInputError('Incorrect game id.')
  }

  const dealer = game.dealer
  const bb = players[getIndex(players, dealer, 2)]
  const sb = players[getIndex(players, dealer, 1)]

  switch (state) {
    case 'preflop':

      bb.stack -= game.bigBlind
      bb.betAmount = game.bigBlind
      sb.stack -= game.smallBlind
      sb.betAmount = game.smallBlind
      await bb.save()
      await sb.save()

      game.potSize += game.bigBlind + game.smallBlind
      game.action = getAction(players, dealer, 3)
      game.curBet = game.bigBlind
      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new Error('Failed to update models.')
      }

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new Error('Failed to publish game.')
      }

      break
    case 'flop':
      game.table.push(game.deck.pop())
      game.table.push(game.deck.pop())
      game.table.push(game.deck.pop())

      await Promise.all(players.map(async (player) => {
        player.betAmount = -1
        try {
          await player.save()
        } catch (err) {
          console.error(err)
          throw new Error('Failed to update models.')
        }
      }))

      game.action = getAction(players, dealer, 1)
      game.prevPotSize = game.potSize
      game.curBet = -1
      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new Error('Failed to update models.')
      }

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new Error('Failed to publish game.')
      }

      if (game.allIn) {
        await snooze(4000)
        gotoNextRound(gameId, models)
      }

      break
    case 'turn':
      game.table.push(game.deck.pop())

      await Promise.all(players.map(async (player) => {
        player.betAmount = -1
        try {
          await player.save()
        } catch (err) {
          console.error(err)
          throw new Error('Failed to update models.')
        }
      }))

      game.action = getAction(players, dealer, 1)
      game.prevPotSize = game.potSize
      game.curBet = -1
      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new Error('Failed to update models.')
      }

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new Error('Failed to publish game.')
      }

      if (game.allIn) {
        await snooze(4000)
        gotoNextRound(gameId, models)
      }

      break
    case 'river':
      game.table.push(game.deck.pop())

      await Promise.all(players.map(async (player) => {
        player.betAmount = -1
        try {
          await player.save()
        } catch (err) {
          console.error(err)
          throw new Error('Failed to update models.')
        }
      }))

      game.action = getAction(players, dealer, 1)
      game.prevPotSize = game.potSize
      game.curBet = -1
      try {
        await game.save()
      } catch (err) {
        console.error(err)
        throw new Error('Failed to update models.')
      }

      try {
        await pubsub.publish(EVENTS.PLAYER.CREATED, {
          change: game
        })
      } catch (err) {
        console.error(err)
        throw new Error('Failed to publish game.')
      }

      if (game.allIn) {
        findNext(models, game.dealer, gameId, 'allIn') // this should be refactored
      }

      break
    default:
      throw new Error('Game state is of invalid state')
  }
  return true
}

export { startNewHand, findNext }
