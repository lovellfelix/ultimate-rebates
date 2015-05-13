'use strict';

// Rebates controller
angular.module('rebates').controller('RebatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rebates', 'Affiliates','Categories',
	function($scope, $stateParams, $location, Authentication, Rebates, Affiliates, Categories ) {
		$scope.authentication = Authentication;
		$scope.affiliates = Affiliates.query();
		$scope.categories = Categories.query();

		// Create new Rebate
		$scope.create = function() {
			// Create new Rebate object
			var rebate = new Rebates ({
				title: this.title,
				affiliate: this.affiliate,
				category: this.category,
				link: this.link,
				discount: this.discount,
				caption: this.caption,
				status: this.status,
				expire: this.expire

			});

			// Redirect after save
			rebate.$save(function(response) {
				$location.path('rebates/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.affiliate = '';
				$scope.link = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rebate
		$scope.remove = function( rebate ) {
			if ( rebate ) { rebate.$remove();

				for (var i in $scope.rebates ) {
					if ($scope.rebates [i] === rebate ) {
						$scope.rebates.splice(i, 1);
					}
				}
			} else {
				$scope.rebate.$remove(function() {
					$location.path('rebates');
				});
			}
		};

		// Update existing Rebate
		$scope.update = function() {
			var rebate = $scope.rebate ;

			rebate.$update(function() {
				$location.path('rebates/' + rebate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rebates
		$scope.find = function() {
			$scope.rebates = Rebates.query();
		};

		// Find existing Rebate
		$scope.findOne = function() {
			$scope.rebate = Rebates.get({
				rebateId: $stateParams.rebateId
			});
		};

		$scope.today = function() {
			$scope.dt = new Date();
		};
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};

// Disable weekend selection
// $scope.disabled = function(date, mode) {
// 	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
// };

$scope.toggleMin = function() {
	$scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();

  $scope.open = function($event) {
	$event.preventDefault();
	$event.stopPropagation();

	$scope.opened = true;
};

$scope.dateOptions = {
	formatYear: 'yy',
	startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[1];

$scope.selected = undefined;
//$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];



	}
]);
