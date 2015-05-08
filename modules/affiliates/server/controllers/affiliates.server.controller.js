'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Affiliate = mongoose.model('Affiliate'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Affiliate
 */
exports.create = function(req, res) {
	var affiliate = new Affiliate(req.body);
	affiliate.user = req.user;

	affiliate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(affiliate);
		}
	});
};

/**
 * Show the current Affiliate
 */
exports.read = function(req, res) {
	res.jsonp(req.affiliate);
};

/**
 * Update a Affiliate
 */
exports.update = function(req, res) {
	var affiliate = req.affiliate ;

	affiliate = _.extend(affiliate , req.body);

	affiliate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(affiliate);
		}
	});
};

/**
 * Delete an Affiliate
 */
exports.delete = function(req, res) {
	var affiliate = req.affiliate ;

	affiliate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(affiliate);
		}
	});
};

/**
 * List of Affiliates
 */
exports.list = function(req, res) { Affiliate.find().sort('-created').populate('user', 'displayName').exec(function(err, affiliates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(affiliates);
		}
	});
};

/**
 * Affiliate middleware
 */
exports.affiliateByID = function(req, res, next, id) { Affiliate.findById(id).populate('user', 'displayName').exec(function(err, affiliate) {
		if (err) return next(err);
		if (! affiliate) return next(new Error('Failed to load Affiliate ' + id));
		req.affiliate = affiliate ;
		next();
	});
};