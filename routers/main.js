const Router = require('koa-router')
const co = require('co')

const mainRouter = Router()

mainRouter.get('/',co.wrap(function *(ctx, next){
	ctx.body = 'root'
}))

const metrics = require('./metrics')
mainRouter.use( metrics.routes(), metrics.allowedMethods() )

module.exports = mainRouter