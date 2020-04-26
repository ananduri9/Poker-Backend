import { PubSub } from 'apollo-server'

import * as PLAYER_EVENTS from './player'

export const EVENTS = {
  PLAYER: PLAYER_EVENTS
}

export default new PubSub()
