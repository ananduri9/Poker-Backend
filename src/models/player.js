import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    stack: {
        type: Number,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    betAmount: {
        type: Number,
    },
    isFolded: {
        type: Boolean,
    },
    isAllIn: {
        type: Boolean,
    },
    handleAllIn: {
        type: Boolean,
    },
    hand: {
        type: Object,
    },
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
});

const Player = mongoose.model('Player', playerSchema);
export default Player;