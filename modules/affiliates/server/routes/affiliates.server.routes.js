'use strict';

module.exports = function(app) {
	var affiliates = require('../controllers/affiliates.server.controller');
	var affiliatesPolicy = require('../policies/affiliates.server.policy');

	// Affiliates Routes
	app.route('/api/affiliates').all()
		.get(affiliates.list).all(affiliatesPolicy.isAllowed)
		.post(affiliates.create);

	app.route('/api/affiliates/:affiliateId').all(affiliatesPolicy.isAllowed)
		.get(affiliates.read)
		.put(affiliates.update)
		.delete(affiliates.delete);

	// Finish by binding the Affiliate middleware
	app.param('affiliateId', affiliates.affiliateByID);
};