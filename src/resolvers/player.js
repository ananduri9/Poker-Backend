import pubsub, { EVENTS } from '../subscription';

import { removePlayer } from '../helpers/functions';

export default {
    Query: {
        player: async (parent, { position, gameId }, { models }) => {
            const player = await models.Player.findOne({position: position, game: gameId});
            if (!player) {
                throw new UserInputError('Failed to find player. Incorrect position or game id.');
            }
        },
        players: async (parent, args, { models }) => {
            return models.Player.find({});
        },
    },

    Mutation: {
        createPlayer: async (
            parent,
            { stack, position, gameId },
            { me, models },
        ) => {
            const game = await models.Game.findOne({_id: gameId});
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }

            let admin = false;
            if (game.numPlayers == 0) {
                admin = true;
            }

            const player = new models.Player({
                stack: stack,
                position: position,
                hand: null,
                betAmount: -1,
                standing: false,
                requestStanding: false,
                requestSitting: false,
                admin: admin,

                game: gameId,
                user: me.id
            });
            if (!player) {
                throw new UserInputError('Failed to create new player.');
            }
            game.numPlayers += 1;

            user.player = player.id;
            game.players.push(player);

            try {
                await user.save();
                await game.save();
                await player.save();
            } catch(err) {
                console.error(err);
                throw Error('Failed to update models.');
            }
            
            try {
                await pubsub.publish(EVENTS.PLAYER.CREATED, {
                    change: game,
                });
            } catch(err) {
                console.error(err);
                throw Error('Failed to publish game.');
            }
            
            return true;
        },

        updateStack: async (
            parent,
            { position, stack, gameId },
            { models },
        ) => {
            const player = await models.Player.findOne({position: position, game: gameId});
            if (!game) {
                throw new UserInputError('Incorrect game id or position.');
            }

            player.stack = stack;

            try {
                await player.save();
            } catch(err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            return true;
        },

        removePlayer: async (
            parent,
            { position, gameId },
            { models },
        ) => {
            return await removePlayer(position, gameId, models);
        },

        sit: async (
            parent,
            { gameId },
            { me, models},
        ) => {
            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }

            const player = await models.Player.findOne({_id: user.player, game: gameId});
            if (!user) {
                throw new UserInputError('Failed to find valid player. Incorrect game id.');
            }

            player.requestSitting = true;

            try {
                await player.save();
            } catch(err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            return true;
        },

        stand: async (
            parent,
            { gameId },
            { me, models},
        ) => {
            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }

            const player = await models.Player.findOne({_id: user.player, game: gameId});
            if (!user) {
                throw new UserInputError('Failed to find valid player. Incorrect game id.');
            }

            try {
                await player.save();
            } catch(err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            return true;
        },
    },

    Player: {
        user: async (player, args, { models }) => {
            const user = await models.User.findOne({
                player: player.id,
            });

            if (!user) {
                throw new ServerError('Failed to find valid user by player id.');
            }

            return user;
        },
        game: async (player, args, { models }) => {
            const game = await models.Game.findOne({
                player: player.id,
            });

            if (!game) {
                throw new ServerError('Failed to find valid game by player id.');
            }

            return game;
        },
    },
};