const mongoose = require('mongoose')
const moment = require('moment')
const expireTime = process.env.TTL

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/metrics')

const Schema = mongoose.Schema

const ActionSchema = new Schema({
	createdAt: {type: Date, expires: expireTime, default: function(){return moment().toDate()} },
	type: {type: String, required: true},
	owner: {type: String, required: true},
	data: {type: Schema.Types.Mixed }
})

const Action = mongoose.model('Action', ActionSchema);

module.exports = mongoose
