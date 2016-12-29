const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')
const moment = require('moment')

const db = require('../lib/mongo')
const Action = db.model('Action')
const owner = db.model('Owner')

const sampleRouter = Router({
	prefix: '/owners'
})

sampleRouter.use(co.wrap(function *(ctx, next){
	yield next()
}))

module.exports = sampleRouter