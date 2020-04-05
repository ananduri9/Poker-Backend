
import { withFilter } from 'apollo-server';
import { Hand } from 'pokersolver';

import pubsub, { EVENTS } from '../subscription';
import Deck from '../deck';

const getAction = (players, curPos, numNext) => {
    const livePlayers = players.filter(player => {
        return (!player.isFolded && !player.isAllIn);
    });

    const numPlayers = livePlayers.length;

    const curIndex = livePlayers.map(player => player.position).indexOf(curPos);
    const nextIndex = (curIndex + numNext) % numPlayers;

    return livePlayers[nextIndex].position;
}

const getPosition = (players, curPos, numNext) => {
    const numPlayers = players.length;

    const curIndex = players.map(player => player.position).indexOf(curPos);

    const nextIndex = (curIndex + numNext) % numPlayers;

    return players[nextIndex].position;
}

const getIndex = (players, curPos, numNext) => {
    const numPlayers = players.length;

    const curIndex = players.map(player => player.position).indexOf(curPos);

    const nextIndex = (curIndex + numNext) % numPlayers;

    return nextIndex;
}

const handleAllIns = async (gameId, models) => {
    console.log('handling all inns');
    const players = await models.Player.find({game: gameId, standing: false}).sort({position: 1});
    const game = await models.Game.findOne({_id: gameId});

    const playersAlive = players.filter(player => (!player.isFolded && !players.handleAllIn));
    const playersAllIn = playersAlive.filter(player => (player.isAllIn && !players.handleAllIn));

    playersAlive.sort((a, b) => a.stack-b.stack); //sort in ascending order of stack size
    const len = playersAlive.length;
    console.log(playersAllIn);
    console.log(playersAlive);

    if (playersAlive.length == playersAllIn.length){
        //person with biggest stack is all in no more
        playersAlive[len-1].isAllIn = false;
        playersAlive[len-1].stack = playersAlive[len-1].betAmount - playersAlive[len-2].betAmount;
        playersAlive[len-1].betAmount = playersAlive[len-1].betAmount - playersAlive[len-1].stack;
        game.potSize -= playersAlive[len-1].stack;
    }

    let numRegular = 0;
    playersAlive.forEach(player => {
        if (!player.isAllIn) {
            numRegular += 1;
        } else {
            player.handleAllIn = true;
        }
    });

    let prevBetAmount = 0;

    if (numRegular == 1) {
        game.allIn = true;
        playersAlive.forEach(player => {
            player.showCards = player.hand;
        })
    } 
    //should use potsize here (previous money already in pot should become part of sidepot)
    playersAlive.forEach((player, index) => {
        if (player.isAllIn) {
            let sidePotSize = (player.betAmount - prevBetAmount + game.prevPotSize) * (len-index);
            console.log(sidePotSize);
            game.sidePot.push({
                size: sidePotSize,
                positions: playersAlive.slice(index).map(player=>player.position),
            });
            game.potSize -= sidePotSize;
            prevBetAmount = player.betAmount;
            game.prevPotSize = 0;
            console.log(prevBetAmount);
        }
    });

    console.log(game.sidePot);

    for (const player of playersAlive) {
        await player.save();
    }
    
    game.handleAllIn = false;

    await game.save();

    return true;

}

const findNext = async (models, startPos, gameId, act) => {
    const players = await models.Player.find({game: gameId, standing: false}).sort({position: 1});
    const game = await models.Game.findOne({_id: gameId});
    let alive = 0;
    const curBet = game.curBet;
    const numPlayers = players.length;
    let aliveIndex;
    console.log(numPlayers);

    for (let i = 1; i < numPlayers; i++) {
        console.log('aaa');
        console.log(players)
        console.log(players.map(player => player.position))
        const curIndex = players.map(player => player.position).indexOf(startPos);
        console.log(startPos);
        console.log(curIndex);
        let index = (curIndex + i) % players.length;
        console.log(index);
        if(!players[index].isFolded) {
            alive += 1;
            console.log('bbb')
            if(!players[index].isAllIn) {
                
                aliveIndex = index;

                console.log(curBet);
                console.log(players[index].betAmount);
                console.log(game.state)
                console.log(index)
                console.log(getIndex(players,game.dealer,2))
                console.log(game.curBet);
                console.log(game.bigBlind)
                console.log(game.state == "preflop");
                console.log(index == getIndex(players,game.dealer,2));
                console.log(game.curBet == game.bigBlind);
                console.log(game.state == "preflop" && (index == getIndex(players,game.dealer,2)) && game.curBet == game.bigBlind);

                if((players[index].betAmount != curBet) || (game.state == "preflop" && (index == getIndex(players,game.dealer,2)) && game.curBet == game.bigBlind)){
                    console.log('next')
                    game.action = players[index].position;

                    await game.save();

                   await pubsub.publish(EVENTS.PLAYER.CREATED, {
                        change: game,
                    });

                    return true;
                }
            }
        }
    }
    console.log(alive)

    if(act=="fold" && alive==1){
        console.log('ccc');
        await wins(game.potSize, players[aliveIndex].position, gameId, models, 1); //with potsize update position's stack

        await pubsub.publish(EVENTS.PLAYER.CREATED, {
            change: game,
        });
    
        await startNewHand(gameId, models);
        return true;
    }

    if(alive>0){
        if (game.handleAllIn) {
            await handleAllIns(gameId, models);
            
            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });
        }
        if(game.state==="river"){
            console.log("rivertime")
            const showDownplayers = players.filter(player => {
                return ((!player.isAllIn && !player.isFolded && player.betAmount == curBet));
            });
            console.log(showDownplayers);
            
            const showDownpositions= showDownplayers.map(player => player.position);

            console.log(showDownpositions);

            //handle all in side pots
            for (const sidePot of game.sidePot) {
                console.log('sidepot');
                console.log(sidePot);
                let { size, positions } = sidePot;
                await showdown(size, positions, gameId, models);
                console.log(game.potSize);
            }
            if (showDownplayers.length > 1) {
                await showdown(game.potSize, showDownpositions, gameId, models);
            }

            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });
        
            await startNewHand(gameId, models);
            return true;
        }
        console.log('gotonextroudn');
        await gotoNextRound(gameId, models);
        return true;
    }

    console.log("error - no live players")
    return false;


    //else, person wins: update persons stack with potsize and start freshhand

};

const wins = async (potSize, position, gameId, models, numWinners) => {
    


    const player = await models.Player.findOne({position: position, game: gameId});
    console.log('inside wins');
    console.log(player)
    player.stack += Math.floor(potSize / numWinners);
    console.log(Math.floor(potSize / numWinners));
    console.log(player.stack)

    await player.save(); 
    return true;
}

const showdown = async (potSize, positions, gameId, models) => {
    const game = await models.Game.findOne({_id: gameId});
    const table = game.table;
    const players = await models.Player.find({
        position: { $in: positions },
        standing: false
    }).sort({position: 1});

    console.log(players)

    const tableCards = table.map(card => {
        return card.number + card.suit;
    });

    console.log(tableCards);

    const playerHands = players.map(player => {
        const card1 = player.hand.card1.number + player.hand.card1.suit;
        const card2 = player.hand.card2.number + player.hand.card2.suit;
        return [card1, card2, ...tableCards];
    });

    console.log(playerHands);

    players.forEach((player, index) => {
        player.hand = playerHands[index];
    });

    console.log(playerHands);

    const solvedHands = playerHands.map(hand => Hand.solve(hand));
    console.log(solvedHands)
    const winningCards = Hand.winners(solvedHands)
    console.log(winningCards)
    const numWinners = winningCards.length;

    for (const cards of winningCards) {

        const winners = cards.cardPool.map(card => card.value + card.suit)


        // const winningCards = playerHands.slice(1).reduce(reducer, playerHands[0]);
        // const winningHand = winningCards.slice(0,2);

        console.log(winners.sort())

        const winner = players.filter(player => {
            console.log(JSON.stringify(player.hand.sort()))
            console.log(JSON.stringify(winners.sort()))
            console.log(JSON.stringify(player.hand.sort())===JSON.stringify(winners.sort()))
            console.log(JSON.stringify(player.hand.sort())==JSON.stringify(winners.sort()));

            return JSON.stringify(player.hand.sort())==JSON.stringify(winners.sort());
        })[0];

        console.log(winner);

        console.log('winnnnnnnnns')
        console.log(potSize)
        console.log(winner.position)
        console.log(numWinners);

        winner.showCards = winner.hand;
        await winner.save();

        await wins(potSize, winner[0].position, gameId, models, numWinners);

    }
    
    return true;
}

const startNewHand = async (gameId, models) => {

    const players = await models.Player.find({game: gameId}).sort({position: 1});
    const game = await models.Game.findOne({_id: gameId});
    
    console.log('here1');

    for (const player of players) {
        if (player.stack <= 0) {
            await removePlayer(player.position, gameId, models);
            continue;
        }
        if (player.requestStanding) {
            player.standing = true;
        }
        if (player.requestSitting) {
            player.standing = false;
        }
        player.betSize = 0;
        player.isFolded = false;
        player.isAllIn = false;
        player.handleAllIn = false;
        player.hand = null;
        await player.save();
    }
    
    game.potSize = 0;
    game.sidePot = [];
    game.allIn = false;
    game.handleAllIn = false;
    game.dealer = await getPosition(players, game.dealer, 1);
    game.table = [];
    game.state = "preflop";
    game.curBet = -1;
    game.prevPotSize = 0;
    console.log('here2');

    await game.save();

    await execState("preflop", gameId, models);

    return true;
}

const gotoNextRound = async (gameId, models) => {
    const game = await models.Game.findOne({_id: gameId});
    switch(game.state) {
        case "preflop":
            await models.Game.updateOne(
                {_id: gameId},
                {
                    state: "flop",
                }
            );
            await execState("flop", gameId, models);
            break;
        case "flop":
            await models.Game.updateOne(
                {_id: gameId},
                {
                    state: "turn",
                }
            );
            await execState("turn", gameId, models);
            break;
        case "turn":
            await models.Game.updateOne(
                {_id: gameId},
                {
                    state: "river",
                }
            );
            await execState("river", gameId, models);

            break;
        case "river": //showdown
            await models.Game.updateOne(
                {_id: gameId},
                {
                    state: "preflop",
                }
            );
            await execState("preflop", gameId, models);
            break;
        default:
    }
    return true;
}

const execState = async (state, gameId, models) => {
    const players = await models.Player.find({game: gameId, standing: false}).sort({position: 1});
    console.log(players);
    const game = await models.Game.findOne({_id: gameId});
    console.log(game);
    const dealer = game.dealer;
    const numPlayers = players.length;
    console.log('here4');

    switch(state) {
        case "preflop":
            let deck = (new Deck).shuffle();
            game.deck = deck;

            players.forEach(player => {
                player.betAmount = -1;
                const card1 = game.deck.pop();
                const number1 = card1.number;
                const suit1 = card1.suit;
                const card2 = game.deck.pop();
                const number2 = card2.number;
                const suit2 = card2.suit;
                
                player.hand = { 
                                card1: {
                                    number: number1,
                                    suit: suit1,
                                },
                                card2: {
                                    number: number2,
                                    suit: suit2,
                                },
                              };       
            });

            const curIndex = players.map(player => player.position).indexOf(dealer);

            players[(curIndex+2) % numPlayers].stack -= game.bigBlind;
            players[(curIndex+2) % numPlayers].betAmount = game.bigBlind;
            game.potSize += game.bigBlind;
            players[(curIndex+1) % numPlayers].stack -= game.smallBlind;
            players[(curIndex+1) % numPlayers].betAmount = game.smallBlind;
            game.potSize += game.smallBlind;
            game.action = await getAction(players, dealer, 3)
            game.curBet = game.bigBlind;

            for (const player of players) {
                await player.save();
            }

            await game.save();

            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });

            console.log('here6');

            if(game.allIn){
                gotoNextRound(gameId, models);
            }

            
            break;
            
        case "flop":

            game.table.push(game.deck.pop());
            game.table.push(game.deck.pop());
            game.table.push(game.deck.pop());

            players.forEach(player => {
                player.betAmount = -1;
            });

            game.action = await getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;

            

            await game.save();
            for (const player of players) {
                await player.save();
            }

            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });

            if(game.allIn){
                gotoNextRound(gameId, models);
            }

            break;
        case "turn":

            game.table.push(game.deck.pop());

            players.forEach(player => {
                player.betAmount = -1;
            });

            game.action = await getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;

            
            await game.save();
            for (const player of players) {
                await player.save();
            }

            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });

            if(game.allIn){
                gotoNextRound(gameId, models);
            }

            break;
        case "river":

            game.table.push(game.deck.pop());

            players.forEach(player => {
                player.betAmount = -1;
            });

            game.action = await getAction(players, dealer, 1);
            game.prevPotSize = game.potSize;
            game.curBet = -1;

            await game.save();
            for (const player of players) {
                await player.save();
            }

            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });

            if(game.allIn){
                findNext(models, game.dealer, gameId, "allIn"); //this should be refactored
            }

            break;
        default:
            console.log("error, game state is an error");
    }
    return true;
}

export default {
    Query: {
        game: async (parent, { id }, { models }) => {
            return models.Game.findOne({_id: id});
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

            await game.save();

            
            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });
            return game.id;
        },

        joinGame: async (
            parent,
            { gameId },
            { models },
        ) => {
            const res = await models.Game.findOne({_id: gameId});
            await pubsub.publish(EVENTS.PLAYER.CREATED, {
                change: game,
            });
            return res;
        },

        startGame: async (
            parent,
            { gameId },
            { me, models },
        ) => {
            const game = await models.Game.findOne({_id: gameId});
            const user = await models.User.findOne({_id: me.id})
            const player = await models.Player.findOne({_id: user.player, game: gameId, standing: false});
            console.log('hiii')
            console.log(player.position);
            console.log(me);
            console.log(game);
            console.log(player);
            game.dealer = player.position;
            await game.save();

            console.log("here");
            await startNewHand(gameId, models);
            return true;
        },

        bet: async (
            parent,
            { position, amount, gameId },
            { me, models },
        ) => {
            // const user = await models.User.findOne({_id: me.id})
            // const player = await models.Player.findOne({_id: user.player, game: gameId});
            const player = await models.Player.findOne({position: position, game: gameId});
            const game = await models.Game.findOne({_id: gameId});
            player.stack -= amount;
            if (player.betAmount == -1) {
                player.betAmount = amount;
            } else {
                player.betAmount += amount;
            }
            game.potSize += amount;
            game.curBet = player.betAmount;

            await player.save();
            await game.save();

            findNext(models, player.position, gameId, "bet");
            return true;
        },

        allIn: async (
            parent,
            { position, gameId },
            { me, models },
        ) => {
            // const user = await models.User.findOne({_id: me.id})
            // const player = await models.Player.findOne({_id: user.player, game: gameId});
            const player = await models.Player.findOne({position: position, game: gameId});
            const game = await models.Game.findOne({_id: gameId});

            player.isAllIn = true;
            if (player.betAmount == -1) {
                player.betAmount = player.stack;
            } else {
                player.betAmount += player.stack;
            }
            
            game.curBet = player.betAmount;
            game.potSize += player.stack;
            game.handleAllIn = true;

            player.stack = 0;

            await player.save();
            await game.save();

            findNext(models, player.position, gameId, "allIn");
            return true;
        },

        fold: async (
            parent,
            { position, gameId },
            { me, models },
        ) => {
            // const user = await models.User.findOne({_id: me.id})
            // const player = await models.Player.findOne({_id: user.player, game: gameId});
            const player = await models.Player.findOne({position: position, game: gameId});
            player.isFolded = true;

            await player.save();

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
            return await models.Player.find({
                game: game.id,
                standing: false,
            });
        },
    },
};