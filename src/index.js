import 'dotenv/config';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import http from 'http';


import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';


const app = express();

app.use(cors());

const getMe = async req => {
    const token = req.headers['x-token'];

    if (token) {
        try {
            return jwt.verify(token, process.env.SECRET);
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
            );
        }
    }
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
        if (connection) {
            return {
                models,
            };
        }
        
        if (req) {
            const me = await getMe(req);
            return {
                models,
                me,
                secret: process.env.SECRET,
            };
        }
    },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = false;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Player.deleteMany({}),
            models.Game.deleteMany({}),
        ]);
    }

    httpServer.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});
