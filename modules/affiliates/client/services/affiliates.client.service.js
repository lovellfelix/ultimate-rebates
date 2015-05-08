'use strict';

//Affiliates service used to communicate Affiliates REST endpoints
angular.module('affiliates').factory('Affiliates', ['$resource',
	function($resource) {
		return $resource('api/affiliates/:affiliateId', { affiliateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);