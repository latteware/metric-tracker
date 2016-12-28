const logger = require('../lib/logger')
const co = require('co')

module.exports = co.wrap(function *(ctx, next) {
	const start = new Date()
	yield next()
	const ms = new Date() - start
	logger.info(`${ctx.status} ${ctx.method} => ${ctx.url} - ${ms}ms`)
})