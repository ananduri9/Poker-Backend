import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  potSize: {
    type: Number,
    required: true
  },
  dealer: {
    type: Number,
    required: true
  },
  smallBlind: {
    type: Number,
    required: true
  },
  bigBlind: {
    type: Number,
    required: true
  },
  numPlayers: {
    type: Number,
    required: true
  },
  table: {
    type: [Object]
  },
  state: {
    type: String
  },
  curBet: {
    type: Number
  },
  action: {
    type: Number
  },
  deck: {
    type: [Object]
  },
  allIn: {
    type: Boolean
  },
  handleAllIn: {
    type: Boolean
  },
  sidePot: {
    type: [Object]
  },
  prevPotSize: {
    type: Number
  },
  winner: {
    type: Number
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
})

gameSchema.pre('remove', function (next) {
  this.model('Player').delete({ game: this._id }, next)
})

const Game = mongoose.model('Game', gameSchema)
export default Game
