'use strict';

// Affiliates controller
angular.module('affiliates').controller('AffiliatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Affiliates',
	function($scope, $stateParams, $location, Authentication, Affiliates ) {
		$scope.authentication = Authentication;

		// Create new Affiliate
		$scope.create = function() {
			// Create new Affiliate object
			var affiliate = new Affiliates ({
				name: this.name
			});

			// Redirect after save
			affiliate.$save(function(response) {
				$location.path('affiliates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Affiliate
		$scope.remove = function( affiliate ) {
			if ( affiliate ) { affiliate.$remove();

				for (var i in $scope.affiliates ) {
					if ($scope.affiliates [i] === affiliate ) {
						$scope.affiliates.splice(i, 1);
					}
				}
			} else {
				$scope.affiliate.$remove(function() {
					$location.path('affiliates');
				});
			}
		};

		// Update existing Affiliate
		$scope.update = function() {
			var affiliate = $scope.affiliate ;

			affiliate.$update(function() {
				$location.path('affiliates/' + affiliate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Affiliates
		$scope.find = function() {
			$scope.affiliates = Affiliates.query();
		};

		// Find existing Affiliate
		$scope.findOne = function() {
			$scope.affiliate = Affiliates.get({ 
				affiliateId: $stateParams.affiliateId
			});
		};
	}
]);