import fs from 'fs'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import http from 'http'
// import https from 'https'
import express from 'express'
import 'dotenv/config'
import path from 'path'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { connectDb } from './models'

const privateKey = fs.readFileSync('sslcert/selfsigned.key', 'utf8')
const certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }

// const forceSsl = function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//         return res.redirect(['https://', req.get('Host'), req.url].join(''));
//     }
//     return next();
// };

const app = express()
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build/')
  app.use(express.static(buildPath))
  // app.use(forceSsl)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  })
} else {
  app.use(cors())
}

const getMe = async req => {
  const token = req.headers.authorization

  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET)
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.'
      )
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models
      }
    }

    if (req) {
      const me = await getMe(req)
      return {
        models,
        me,
        secret: process.env.SECRET
      }
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

// const httpsServer = https.createServer(credentials, app);
// server.installSubscriptionHandlers(httpsServer);

const httpServer = http.createServer(credentials, app)
server.installSubscriptionHandlers(httpServer)

const isTest = process.env.NODE_ENV === 'test'
const eraseDatabaseOnSync = false

const port = process.env.PORT || 8000

connectDb().then(async () => {
  if (isTest || eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Player.deleteMany({}),
      models.Game.deleteMany({})
    ])
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`)
  })
})
