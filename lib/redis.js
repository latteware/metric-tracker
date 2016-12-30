const redis = require('then-redis')
const url = require('url')

const redisFormat = {
	protocol: 'redis',
	slashes: true,
	hostname: process.env.REDIS_HOST || 'localhost',
	port: process.env.REDIS_PORT || '6379',
	pathname: process.env.REDIS_DB || 0
}

if( process.env.REDIS_USER && process.env.REDIS_PASSWORD ){
	redisFormat.auth= process.env.REDIS_USER + ':' + process.env.REDIS_PASSWORD
}

const redisUrl = url.format(redisFormat)

const client = redis.createClient({
	url: redisUrl
})

module.exports = client

