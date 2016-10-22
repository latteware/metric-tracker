const Koa = require('koa')
const co = require('co')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')

const errorHandler = require('./middlewares/errorHandler')
const logger = require('./middlewares/logger')

const server = new Koa()

// Body parser
server.use( convert( bodyParser() ) ) 

// Error handler
server.use( co.wrap(errorHandler) )

// Logs response time and status
server.use( convert(logger) )

// Loads app routers
const mainRouter = require('./routers/main')
server.use(mainRouter.routes()).use(mainRouter.allowedMethods())

module.exports = server
