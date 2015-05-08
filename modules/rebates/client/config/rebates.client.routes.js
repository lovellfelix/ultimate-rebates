'use strict';

//Setting up route
angular.module('rebates').config(['$stateProvider',
	function($stateProvider) {
		// Rebates state routing
		$stateProvider.
		state('rebates', {
			abstract: true,
			url: '/rebates',
			template: '<ui-view/>'
		}).
		state('rebates.list', {
			url: '',
			templateUrl: 'modules/rebates/views/list-rebates.client.view.html'
		}).
		state('rebates.create', {
			url: '/create',
			templateUrl: 'modules/rebates/views/create-rebate.client.view.html'
		}).
		state('rebates.view', {
			url: '/:rebateId',
			templateUrl: 'modules/rebates/views/view-rebate.client.view.html'
		}).
		state('rebates.edit', {
			url: '/:rebateId/edit',
			templateUrl: 'modules/rebates/views/edit-rebate.client.view.html'
		});
	}
]);