'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Rebate = mongoose.model('Rebate'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Rebate
 */
exports.create = function(req, res) {
	var rebate = new Rebate(req.body);
	rebate.user = req.user;

	rebate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rebate);
		}
	});
};

/**
 * Show the current Rebate
 */
exports.read = function(req, res) {
	res.jsonp(req.rebate);
};

/**
 * Update a Rebate
 */
exports.update = function(req, res) {
	var rebate = req.rebate ;

	rebate = _.extend(rebate , req.body);

	rebate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rebate);
		}
	});
};

/**
 * Delete an Rebate
 */
exports.delete = function(req, res) {
	var rebate = req.rebate ;

	rebate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rebate);
		}
	});
};

/**
 * List of Rebates
 */
exports.list = function(req, res) { Rebate.find().sort('-created').populate('user', 'displayName').exec(function(err, rebates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rebates);
		}
	});
};

/**
 * Rebate middleware
 */
exports.rebateByID = function(req, res, next, id) { Rebate.findById(id).populate('user', 'displayName').exec(function(err, rebate) {
		if (err) return next(err);
		if (! rebate) return next(new Error('Failed to load Rebate ' + id));
		req.rebate = rebate ;
		next();
	});
};