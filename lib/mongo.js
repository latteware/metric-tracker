const mongoose = require('mongoose')
const moment = require('moment')
const url = require('url')

const expireTime = process.env.DATA_TTL

const mongoFormat = {
	protocol: 'mongodb',
	slashes: true,
	hostname: process.env.MONGO_HOST || 'localhost',
	port: process.env.MONGO_PORT || '27017',
	pathname: process.env.MONGO_DB || 'metrics'
}

if( process.env.MONGO_USER && process.env.MONGO_PASSWORD ){
	mongoFormat.auth= process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD
}

const mongoUrl = url.format(mongoFormat)

mongoose.Promise = Promise
mongoose.connect(mongoUrl)

const Schema = mongoose.Schema

const OwnerSchema = new Schema({
	_id: {type: String},
	lastUpdate: {type: Date, expires: '30 days' },
	createdAt: {type: Date, default: function(){return moment().toDate()} }
})

OwnerSchema.pre('save', function(next){
	const now = moment().toDate()
	this.lastUpdate = now

	next()
})

OwnerSchema.methods.toPublic = function(){
	return {
		lastUpdate: this.lastUpdate,
		createdAt: this.createdAt
	}
}

const ActionSchema = new Schema({
	createdAt: {type: Date, expires: expireTime, default: function(){return moment().toDate()} },
	type: {type: String, required: true},
	owner: {type: String, required: true, ref: 'Owner'},
	data: {type: Schema.Types.Mixed }
})

const Action = mongoose.model('Action', ActionSchema)
const Owner = mongoose.model('Owner', OwnerSchema)

module.exports = mongoose
