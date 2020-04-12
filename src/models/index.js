import mongoose from 'mongoose';

import Game from './game';
import User from './user';
import Player from './player';

const db = (process.env.NODE_ENV == 'test') ? process.env.TEST_DATABASE : process.env.DATABASE_URL

const connectDb = () => {
  return mongoose.connect(db);
};

const models = { User, Game, Player };

export { connectDb };
export default models;