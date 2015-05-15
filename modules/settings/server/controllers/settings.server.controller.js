'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Setting = mongoose.model('Setting'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Setting
 */
exports.create = function(req, res) {
	var setting = new Setting(req.body);
	setting.user = req.user;

	setting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setting);
		}
	});
};

/**
 * Show the current Setting
 */
exports.read = function(req, res) {
	res.jsonp(req.setting);
};

/**
 * Update a Setting
 */
exports.update = function(req, res) {
	var setting = req.setting ;

	setting = _.extend(setting , req.body);

	setting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setting);
		}
	});
};

/**
 * Delete an Setting
 */
exports.delete = function(req, res) {
	var setting = req.setting ;

	setting.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setting);
		}
	});
};

/**
 * List of Settings
 */
exports.list = function(req, res) { Setting.find().sort('-created').populate('user', 'displayName').exec(function(err, settings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(settings);
		}
	});
};

/**
 * Setting middleware
 */
exports.settingByID = function(req, res, next, id) { Setting.findById(id).populate('user', 'displayName').exec(function(err, setting) {
		if (err) return next(err);
		if (! setting) return next(new Error('Failed to load Setting ' + id));
		req.setting = setting ;
		next();
	});
};