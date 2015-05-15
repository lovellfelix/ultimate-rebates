'use strict';

module.exports = function(app) {
	var settings = require('../controllers/settings.server.controller');
	var settingsPolicy = require('../policies/settings.server.policy');

	// Settings Routes
	app.route('/api/settings').all()
		.get(settings.list).all(settingsPolicy.isAllowed)
		.post(settings.create);

	app.route('/api/settings/:settingId').all(settingsPolicy.isAllowed)
		.get(settings.read)
		.put(settings.update)
		.delete(settings.delete);

	// Finish by binding the Setting middleware
	app.param('settingId', settings.settingByID);
};