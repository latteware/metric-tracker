const logger = require('../lib/logger')

module.exports = function *(ctx, next) {
	try {
		yield next()
	} catch (err) {
		if(err.name === 'ValidationError'){
			err.status = 422
		}

		ctx.status = err.status || 500

		if(ctx.status === 403){
			logger.info('Forbidden:', err)
		}else if(ctx.status === 404){
			logger.info('Not found:', err)
		}else if(ctx.status === 422){
			logger.info('Validation error:', err)
		}else{
			logger.error('Invalid request:', err, ctx.request.headers)
			ctx.app.emit('error', err, ctx)
		}

		// json
		if (ctx.request.headers['content-type'] === 'application/json') {
			ctx.body = { error: err.message }
			return
		}

		// html
		if (process.env.NODE_ENV === 'production') {
			yield ctx.render('public/errors', {
				status: ctx.status
			})
		} else {
			ctx.body = err.stack
		}
	}

	// Unhandle 404
	if(ctx.status === 404){
		if (process.env.NODE_ENV === 'production') {
			ctx.status = 404
			yield ctx.render('public/errors', {
				status: ctx.status
			})
		} else {
			ctx.status = 404
			ctx.body = 'Not found'
		}
	}
}
