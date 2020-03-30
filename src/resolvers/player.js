const removePlayer = async (position, gameId, models) =>  {
    const game = await models.Game.findOne({_id: gameId});
    game.numPlayers -= 1;
    game.players.filter(player => {
        player.position != position;
    });
    await game.save();
    await models.Player.findOneAndRemove({position: position, game: gameId});
    return true;
};

export default {
    Query: {
        player: async (parent, { id }, { models }) => {
            return await models.Player.findOne({_id: id});
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
            const user = await models.User.findOne({_id: me.id})
            const player = new models.Player({
                stack: stack,
                position: position,
                hand: null,
                betAmount: -1,
                standing: false,
                requestStanding: false,
                requestSitting: false,

                game: gameId,
                user: me.id
            });
            game.numPlayers += 1;

            user.player = player.id;
            game.players.push(player);

            await user.save();
            await game.save();
            await player.save();
            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: { gameState: game },
            });
            return true;
        },

        updateStack: async (
            parent,
            { position, stack, gameId },
            { models },
        ) => {
            const player = await models.Player.findOne({position: position, game: gameId});
            player.stack = stack;
            await player.save();

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
            const player = await models.Player.findOne({_id: user.player, game: gameId});
            player.requestSitting = true;
            await player.save();
            return true;
        },

        stand: async (
            parent,
            { gameId },
            { me, models},
        ) => {
            const user = await models.User.findOne({_id: me.id})
            const player = await models.Player.findOne({_id: user.player, game: gameId});
            player.requestStanding = true;
            await player.save();
            return true;
        },
    },

    Player: {
        user: async (player, args, { models }) => {
            return await models.User.findOne({
                player: player.id,
            });
        },
        game: async (player, args, { models }) => {
            return await models.Game.findOne({
                player: player.id,
            });
        },
    },
};