const redis = require('then-redis')

const client = redis.createClient()
module.exports = client

