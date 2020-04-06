import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    venmo: {
        type: String,
    },
    role: {
        type: String
    },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
});

userSchema.statics.findByLogin = async function (username) {
    let user = await this.findOne({
        username: username,
    });

    return user;
};

userSchema.methods.validatePassword = async function(password) {
    console.log('this.password');
    return await bcrypt.compare(password, this.password);
};

// userSchema.methods.generatePasswordHash = async function (password) {
//     const saltRounds = 10;
//     return await bcrypt.hash(password, saltRounds);
// };

// userSchema.pre('save', async user => {
//     if (user.username === 'jmay' || user.username === 'ananduri'){
//         this.role = 'ADMIN';
//     }
// });

userSchema.pre('remove', function(next) {
    this.model('Player').deleteOne({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;