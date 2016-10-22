const logger = require('../lib/logger')

module.exports = function *(next) {
	const start = new Date();
	yield next
	const ms = new Date() - start;
	logger.info(`${this.status} ${this.method} => ${this.url} - ${ms}ms`);
}
