'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Category = mongoose.model('Category'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Category
 */
exports.create = function(req, res) {
	var category = new Category(req.body);
	category.user = req.user;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;

	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
	var category = req.category ;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) { Category.find().sort('-created').populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) { Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (! category) return next(new Error('Failed to load Category ' + id));
		req.category = category ;
		next();
	});
};