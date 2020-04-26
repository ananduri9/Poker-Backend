import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  stack: {
    type: Number,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  betAmount: {
    type: Number
  },
  isFolded: {
    type: Boolean
  },
  isAllIn: {
    type: Boolean
  },
  handleAllIn: {
    type: Boolean
  },
  hand: {
    type: Object
  },
  showCards: {
    type: Object
  },
  standing: {
    type: Boolean
  },
  requestStanding: {
    type: Boolean
  },
  requestSitting: {
    type: Boolean
  },
  admin: {
    type: Boolean
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
})

const Player = mongoose.model('Player', playerSchema)
export default Player
