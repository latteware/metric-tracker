const mongoose = require('mongoose')
const moment = require('moment')
const expireTime = process.env.DATA_TTL

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/metrics')

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
