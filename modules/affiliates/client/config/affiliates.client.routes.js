'use strict';

//Setting up route
angular.module('affiliates').config(['$stateProvider',
	function($stateProvider) {
		// Affiliates state routing
		$stateProvider.
		state('affiliates', {
			abstract: true,
			url: '/affiliates',
			template: '<ui-view/>'
		}).
		state('affiliates.list', {
			url: '',
			templateUrl: 'modules/affiliates/views/list-affiliates.client.view.html'
		}).
		state('affiliates.create', {
			url: '/create',
			templateUrl: 'modules/affiliates/views/create-affiliate.client.view.html'
		}).
		state('affiliates.view', {
			url: '/:affiliateId',
			templateUrl: 'modules/affiliates/views/view-affiliate.client.view.html'
		}).
		state('affiliates.edit', {
			url: '/:affiliateId/edit',
			templateUrl: 'modules/affiliates/views/edit-affiliate.client.view.html'
		});
	}
]);