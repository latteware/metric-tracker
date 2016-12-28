const logger = require('../lib/logger')
const co = require('co')
const hasAuth = process.env.HTTP_AUTH
const authTokens = require('../auth-tokens')

module.exports = co.wrap(function *(ctx, next) {
	if(hasAuth){
		if(!ctx.headers.authorization){
			ctx.throw(403, 'invalid authorization headers')
		}

		var username = ctx.headers.authorization.split(' ')[0]
		var token = ctx.headers.authorization.split(' ')[1]

		if(!username || !token){
			ctx.throw(403, 'invalid authorization headers')
		}

		username = username.toLowerCase()
		if(authTokens[username] && authTokens[username] === token){
			yield next()
		}else{
			ctx.throw(403, 'invalid authorization headers')
		}
	}else{
		yield next()
	}
})