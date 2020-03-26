import mongoose from 'mongoose';

import Game from './game';
import User from './user';
import Player from './player';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

const models = { User, Game, Player };

export { connectDb };
export default models;