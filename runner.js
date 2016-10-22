const logger = require('./lib/logger')
const server = require('./server.js')

server.listen(process.env.PORT || 3000, function () {
	logger.info('Server running at', process.env.PORT || 3000)
})