import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';

const createToken = async (user, secret) => {
    const {id, username, role, player } = user;
    return jwt.sign({ id, username, role, player }, secret);
};

const generatePasswordHash = async function (password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export default {
    Query: {
        me: async (parent, args, { me, models }) => {
            if (!me) {
                return null;
            }

            return await models.User.findOne({_id: me.id})
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findOne({_id: id});
        },
        users: async (parent, args, { models }) => {
            return await models.User.find({});
        },
    },

    Mutation: {
        signUp: async (
            parent,
            { username, password, venmo },
            { models, secret }
        ) => {
            const user = await new models.User({
                username,
                password: await generatePasswordHash(password),
                venmo: venmo,
            });

            await user.save();

            return { token: createToken(user, secret) }
        },

        signIn: async (
            parent,
            { username, password },
            { models, secret },
        ) => {
            const user = await models.User.findByLogin(username);

            if (!user) {
                throw new UserInputError(
                    'No user found with this login credentials.',
                );
            }

            const isValid = await user.validatePassword(password);

            if (!isValid) {
                throw new Error('Invalid password.');
            }

            return { token: createToken(user, secret) };
        },

        deleteUser:  async (parent, { id }, { models }) => {
                await models.User.findOneAndRemove({_id: id});
                return true;
        },
    },

    User: {
        player: async (user, args, { models }) => {
            return await models.Player.findOne({
                user: user.id,
            });
        },
    },
};