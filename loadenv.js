const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const dotenv = require('dotenv')

try {
	fs.statSync('.env')
	dotenv.load({ path: path.resolve('.env') })
} catch (e) {}

dotenv.load({ path: path.resolve('.env.default') })