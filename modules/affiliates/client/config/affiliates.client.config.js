'use strict';

// Configuring the Affiliates module
angular.module('affiliates').run(['Menus',
	function(Menus) {
		// Add the Affiliates dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Affiliates',
			state: 'affiliates',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'affiliates', {
			title: 'List Affiliates',
			state: 'affiliates.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'affiliates', {
			title: 'Create Affiliate',
			state: 'affiliates.create'
		});
	}
]);