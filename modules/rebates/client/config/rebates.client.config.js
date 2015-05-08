'use strict';

// Configuring the Rebates module
angular.module('rebates').run(['Menus',
	function(Menus) {
		// Add the Rebates dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Rebates',
			state: 'rebates',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'rebates', {
			title: 'List Rebates',
			state: 'rebates.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'rebates', {
			title: 'Create Rebate',
			state: 'rebates.create'
		});
	}
]);
