import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  venmo: {
    type: String
  },
  role: {
    type: String
  },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
})

userSchema.statics.findByLogin = async function (username) {
  const user = await this.findOne({
    username: username
  })
  return user
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.pre('remove', function (next) {
  this.model('Player').deleteOne({ user: this._id }, next)
})

const User = mongoose.model('User', userSchema)
export default User
