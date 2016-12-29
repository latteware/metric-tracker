const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')
const moment = require('moment')

const db = require('../lib/mongo')
const Action = db.model('Action')
const Owner = db.model('Owner')

const ownersRouter = Router({
	prefix: '/owners'
})

ownersRouter.use(co.wrap(function *(ctx, next){
	yield next()
}))

ownersRouter.get('/', co.wrap(function *(ctx, next){
	const owners = yield Owner.find({}).select('id')
	
	ctx.body = owners.map( owner => owner.id )
}))

ownersRouter.get('/:owner', co.wrap(function *(ctx, next){
	var owner = yield Owner.findOne({_id:ctx.params.owner})
	
	if(!owner){
		ctx.throw(404, 'owner not found')
	}

	owner = owner.toPublic()
	owner.actions = yield Action.find({owner:ctx.params.owner}).select('-owner -_id -__v')
	ctx.body = owner
}))

module.exports = ownersRouter