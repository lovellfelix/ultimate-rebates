'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider','$mdThemingProvider',
	function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});

		//Theme
		$mdThemingProvider.theme('default')
		.primaryPalette('light-blue')
		.accentPalette('orange');

	}
]);
