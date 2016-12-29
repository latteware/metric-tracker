const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')
const moment = require('moment')

const redisClient = require('../lib/redis')
const expireTime = process.env.METRICS_TTL

const db = require('../lib/mongo')
const Action = db.model('Action')
const Owner = db.model('Owner')

const actionsRouter = Router({
	prefix: '/actions'
})

actionsRouter.use(co.wrap(function *(ctx, next){
	var mongoQuery = {}

	var queryString = ctx.request.query
	var startDate
	var endDate

	if(queryString.startDate){
		try{
			var mStartDate = moment(queryString.startDate + '+0000', 'YYYY-MM-DD-HH:mm Z')
			startDate = mStartDate.toDate()
		}catch(e){
			ctx.throw(422, 'Invalid startDate')
		}
	}


	if(queryString.endDate){
		try{
			var mEndDate = moment(queryString.endDate + '+0000', 'YYYY-MM-DD-HH:mm Z')
			endDate = mEndDate.toDate()
		}catch(e){
			ctx.throw(422, 'Invalid endDate')
		}
	}

	if(startDate && endDate){
		mongoQuery.createdAt = {$gte: startDate, $lte: endDate}
	}else if(startDate){
		mongoQuery.createdAt = {$gte: startDate}
	}else if(endDate){
		mongoQuery.createdAt = {$lte: endDate}
	}


	ctx.state.query = mongoQuery

	yield next()
}))

actionsRouter.get('/',co.wrap(function *(ctx, next){
	const query = ctx.state.query
	const type = ctx.request.query.type

	if(type && _.isArray(type)){
		query.type = {$in:type}
	}else if(type){
		query.type = type
	}

	ctx.body = yield Action.find(query)
}))

actionsRouter.get('/owner/:owner',co.wrap(function *(ctx, next){
	const query = ctx.state.query
	const owner = ctx.params.owner

	query.owner = owner

	ctx.body = yield Action.find(query)
}))

actionsRouter.get('/type/:type',co.wrap(function *(ctx, next){
	const query = ctx.state.query
	const type = ctx.params.type

	query.type = type

	ctx.body = yield Action.find(query)
}))

actionsRouter.post('/:owner/:type',co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const type = ctx.params.type

	var owner = yield Owner.findOne({_id: ctx.params.owner})
	if(!owner){
		owner = new Owner({_id: ctx.params.owner})
		yield owner.save()
	}

	// Array
	const metrics = body.metrics || []
	// Append to metrics type. String
	var metricSuffix = body.metricSuffix
	if(!metricSuffix){
		metricDaySuffix = moment().format('MM-DD')
	}

	const action = new Action({
		owner,
		type,
		data: body.data || {},
		metrics
	})

	const baseKey = `${type}-${metricDaySuffix}`

	yield redisClient.incr(`metrics:${baseKey}!`)
	yield redisClient.expire(`metrics:${baseKey}!`, expireTime)

	if(metrics){
		for(var key of metrics){			
			yield redisClient.incr(`metrics:${baseKey}.${key}`)
			yield redisClient.expire(`metrics:${baseKey}.${key}`, expireTime)
		}
	}	

	yield action.save()
	ctx.body = {success:true, id:action.id}
}))

module.exports = actionsRouter