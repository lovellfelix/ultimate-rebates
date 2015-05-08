'use strict';

module.exports = function(app) {
	var rebates = require('../controllers/rebates.server.controller');
	var rebatesPolicy = require('../policies/rebates.server.policy');

	// Rebates Routes
	app.route('/api/rebates').all()
		.get(rebates.list).all(rebatesPolicy.isAllowed)
		.post(rebates.create);

	app.route('/api/rebates/:rebateId').all(rebatesPolicy.isAllowed)
		.get(rebates.read)
		.put(rebates.update)
		.delete(rebates.delete);

	// Finish by binding the Rebate middleware
	app.param('rebateId', rebates.rebateByID);
};