const removePlayer = async (position, gameId, models) =>  {
    const game = await models.Game.findOne({_id: gameId});
    if (!game) {
        throw new UserInputError('Incorrect game id.');
    }

    game.numPlayers -= 1;
    game.players.filter(player => {
        player.position != position;
    });

    try {
        await game.save();
    } catch(err) {
        throw Error('Failed to update models.');
    }

    try {
        await models.Player.findOneAndRemove({position: position, game: gameId});
    } catch(err) {
        throw new UserInputError('Failed to delete player');
    }
    
    return true;
};

export { removePlayer };