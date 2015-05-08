'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rebate Schema
 */
var RebateSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Rebate Title',
		trim: true
	},
	caption: {
		type: String,
		default: '',
		trim: true
	},
	affiliate: {
		type: String,
		default: '',
		required: 'Please fill Rebate Affilate',
		trim: true
	},
	category: {
		type: String,
		default: '',
		required: 'Please select category',
		trim: true
	},
	link: {
		type: String,
		default: '',
		required: 'Please fill in link',
		trim: true
	},
	discount: {
		type: String,
		default: '',
		required: 'Please fill discount',
		trim: true
	},
	featured: {
		type: String,
		default: 'true',
		trim: true
	},
	status: {
		type: String,
		default: 'true',
		trim: true
	},
	expire: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rebate', RebateSchema);
