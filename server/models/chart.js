const mongoose = require('mongoose')
const moment = require('moment-timezone')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const ChartSchema = new Schema({
	classCd: {
		type: String,
		required: true
	},
	chartType: {
		type: String,
		default: ''
	},
	songs: [{
        rank: {
            type: Number,
    		required: true
        },
        title: {
            type: String,
    		required: true
        },
        artist: {
            type: String,
    		required: true
        },
		videoId: {
			type: String,
			required: true
		},
		videoTitle: {
			type: String,
			required: true
		}
    }],
	chartDate: { type: String },
	retrievedDate: { type: String }
})

const Chart = mongoose.model('Chart', ChartSchema)

module.exports = Chart
