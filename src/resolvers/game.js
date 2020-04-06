
import { withFilter } from 'apollo-server';

import pubsub, { EVENTS } from '../subscription';
import { startNewHand, findNext } from '../helpers/pokerLifeCycle';

export default {
    Query: {
        game: async (parent, { id }, { models }) => {
            const game = models.Game.findOne({ _id: id });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }
            return game;
        },

        getData: async(
            parent,
            { gameId },
            { models },
        ) => {
            const game = await models.Game.findOne({ _id: gameId });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

            try {
                await pubsub.publish(EVENTS.PLAYER.CREATED, {
                    change: game,
                });
            } catch (err) {
                console.error(err);
                throw Error('Failed to publish game.');
            }

            return true;
        },
    },

    Mutation: {
        createGame: async (
            parent,
            { sBlind, bBlind },
            { models },
        ) => {
            const game = new models.Game({
                potSize: 0,
                smallBlind: sBlind,
                bigBlind: bBlind,
                dealer: 0,
                numPlayers: 0,
                table: [],
                prevPotSize: 0,
            });
            if (!game) {
                throw new UserInputError('Failed to create new game.');
            }

            try {
                await game.save();
            } catch (err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            try {
                await pubsub.publish(EVENTS.PLAYER.CREATED, {
                    change: game,
                });
            } catch (err) {
                console.error(err);
                throw Error('Failed to publish game.');
            }

            return game.id;
        },

        joinGame: async (
            parent,
            { gameId },
            { models },
        ) => {
            const game = await models.Game.findOne({ _id: gameId });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

           try {
                await pubsub.publish(EVENTS.PLAYER.CREATED, {
                    change: game,
                });
            } catch (err) {
                console.error(err);
                throw Error('Failed to publish game.');
            }

            return true;
        },

        startGame: async (
            parent,
            { gameId },
            { me, models },
        ) => {
            const game = await models.Game.findOne({ _id: gameId });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

            const user = await models.User.findOne({ _id: me.id })
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }
            const player = await models.Player.findOne({ _id: user.player, game: gameId, standing: false });
            if (!user) {
                throw new UserInputError('Failed to find valid player.');
            }

            game.dealer = player.position;

            try {
                await game.save();
            } catch (err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            await startNewHand(gameId, models);
            return true;
        },

        bet: async (
            parent,
            { position, amount, gameId },
            { me, models },
        ) => {
            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }
            const player = await models.Player.findOne({_id: user.player, game: gameId});
            if (!player) {
                throw new UserInputError('Failed to find player user.');
            }
            
            // const player = await models.Player.findOne({ position: position, game: gameId });
            const game = await models.Game.findOne({ _id: gameId });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

            player.stack -= amount;
            if (player.betAmount == -1) {
                player.betAmount = amount;
            } else {
                player.betAmount += amount;
            }

            game.potSize += amount;
            game.curBet = player.betAmount;

            try {
                await player.save();
                await game.save();
            } catch (err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            findNext(models, player.position, gameId, "bet");
            return true;
        },

        allIn: async (
            parent,
            { position, gameId },
            { me, models },
        ) => {
            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }
            const player = await models.Player.findOne({_id: user.player, game: gameId});
            if (!player) {
                throw new UserInputError('Failed to find player user.');
            }

            // const player = await models.Player.findOne({ position: position, game: gameId });
            const game = await models.Game.findOne({ _id: gameId });
            if (!game) {
                throw new UserInputError('Incorrect game id.');
            }

            player.isAllIn = true;
            player.stack = 0;
            if (player.betAmount == -1) {
                player.betAmount = player.stack;
            } else {
                player.betAmount += player.stack;
            }
            
            game.curBet = player.betAmount;
            game.potSize += player.stack;
            game.handleAllIn = true;

            
            try {
                await player.save();
                await game.save();
            } catch (err) {
                console.error(err);
                throw Error('Failed to update models.');
            }
            
            findNext(models, player.position, gameId, "allIn");
            return true;
        },

        fold: async (
            parent,
            { position, gameId },
            { me, models },
        ) => {
            const user = await models.User.findOne({_id: me.id})
            if (!user) {
                throw new UserInputError('Failed to find valid user.');
            }
            const player = await models.Player.findOne({_id: user.player, game: gameId});
            if (!player) {
                throw new UserInputError('Failed to find player user.');
            }

            // const player = await models.Player.findOne({ position: position, game: gameId });
            player.isFolded = true;

            await player.save();

            try {
                await player.save();
            } catch (err) {
                console.error(err);
                throw Error('Failed to update models.');
            }

            findNext(models, player.position, gameId, "fold");
            return true;
        },

    },

    Subscription: {
        change: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(EVENTS.PLAYER.CREATED),
                (payload, variables) => {
                    return variables.gameId === payload.change.id
                }
            )
        },
    },

    Game: {
        players: async (game, args, { models }) => {
            const player = await models.Player.find({
                game: game.id,
                standing: false,
            });
            if (!player) {
                throw new UserInputError('Failed to find player user.');
            }

            return player;
        },
    },
};