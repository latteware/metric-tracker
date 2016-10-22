const bunyan = require('bunyan')

const config = {
	name: 'main',
	streams: [
		{
			level: 'info',
			stream: process.stdout
		}
	]
}

if ( process.env.NODE_ENV === 'test' ) {
	config.streams = []
}

if (process.env.NODE_ENV === 'production' ) {
	config.streams.push({
		level: 'info',
		path: '/var/tmp/nodebox-errors.log'
	})
}

const log = bunyan.createLogger(config)

log.info('Log started at', new Date())

module.exports = log
