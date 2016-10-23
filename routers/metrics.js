const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')

const redisClient = require('../lib/redis')
const expireTime = process.env.TTL

const metricsRouter = Router({
	prefix: '/metrics'
})

metricsRouter.use(co.wrap(function *(ctx, next){
	yield next()
}))

metricsRouter.get('/',co.wrap(function *(ctx, next){
	const keys = yield redisClient.keys('metrics:*!')

	if(_.isEmpty(keys)){return ctx.body = {}}
	const metrics = yield redisClient.mget(keys)

	ctx.body = _.zipObject(keys.map( key => key.replace('metrics:', '').replace(/!/g, '') ), metrics)
}))

metricsRouter.get('/:metricKey',co.wrap(function *(ctx, next){
	const baseKey = ctx.params.metricKey

	const keys = yield redisClient.keys(`metrics:${baseKey}*`)

	if(_.isEmpty(keys)){return ctx.body = {}}
	const metrics = yield redisClient.mget(keys)
	const data = _.zipObjectDeep( keys , metrics)
	const details = data[`metrics:${baseKey}`]
	const total = data[`metrics:${baseKey}!`]

	ctx.body = {
		details : details,
		total: total
	}
}))

metricsRouter.post('/:metricKey',co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const keys = body.keys
	const baseKey = ctx.params.metricKey

	yield redisClient.incr(`metrics:${baseKey}!`)
	yield redisClient.expire(`metrics:${baseKey}!`, expireTime)

	if(keys){
		for(var key of keys){			
			yield redisClient.incr(`metrics:${baseKey}.${key}`)
			yield redisClient.expire(`metrics:${baseKey}.${key}`, expireTime)
		}
	}

	ctx.body = {success:true}
}))

module.exports = metricsRouter