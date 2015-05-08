'use strict';

//Rebates service used to communicate Rebates REST endpoints
angular.module('rebates').factory('Rebates', ['$resource',
	function($resource) {
		return $resource('api/rebates/:rebateId', { rebateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);