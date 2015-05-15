'use strict';

// Configuring the Settings module
angular.module('settings').run(['Menus',
	function(Menus) {
		// Add the Settings dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Settings',
			state: 'settings',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'settings', {
			title: 'List Settings',
			state: 'settings.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'settings', {
			title: 'Create Setting',
			state: 'settings.create'
		});
	}
]);