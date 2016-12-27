const Router = require('koa-router')
const co = require('co')

const mainRouter = Router()

mainRouter.get('/',co.wrap(function *(ctx, next){
	ctx.type = 'text/html'
	ctx.body = 'Visit <a href="https://github.com/latteware/metric-tracker">this link</a> for the docs'
}))

const metrics = require('./metrics')
mainRouter.use( metrics.routes(), metrics.allowedMethods() )

const actions = require('./actions')
mainRouter.use( actions.routes(), actions.allowedMethods() )

module.exports = mainRouter