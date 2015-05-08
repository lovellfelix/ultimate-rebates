'use strict';

(function() {
	// Rebates Controller Spec
	describe('Rebates Controller Tests', function() {
		// Initialize global variables
		var RebatesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Rebates controller.
			RebatesController = $controller('RebatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rebate object fetched from XHR', inject(function(Rebates) {
			// Create sample Rebate using the Rebates service
			var sampleRebate = new Rebates({
				name: 'New Rebate'
			});

			// Create a sample Rebates array that includes the new Rebate
			var sampleRebates = [sampleRebate];

			// Set GET response
			$httpBackend.expectGET('api/rebates').respond(sampleRebates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rebates).toEqualData(sampleRebates);
		}));

		it('$scope.findOne() should create an array with one Rebate object fetched from XHR using a rebateId URL parameter', inject(function(Rebates) {
			// Define a sample Rebate object
			var sampleRebate = new Rebates({
				name: 'New Rebate'
			});

			// Set the URL parameter
			$stateParams.rebateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/rebates\/([0-9a-fA-F]{24})$/).respond(sampleRebate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rebate).toEqualData(sampleRebate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rebates) {
			// Create a sample Rebate object
			var sampleRebatePostData = new Rebates({
				name: 'New Rebate'
			});

			// Create a sample Rebate response
			var sampleRebateResponse = new Rebates({
				_id: '525cf20451979dea2c000001',
				name: 'New Rebate'
			});

			// Fixture mock form input values
			scope.name = 'New Rebate';

			// Set POST response
			$httpBackend.expectPOST('api/rebates', sampleRebatePostData).respond(sampleRebateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rebate was created
			expect($location.path()).toBe('/rebates/' + sampleRebateResponse._id);
		}));

		it('$scope.update() should update a valid Rebate', inject(function(Rebates) {
			// Define a sample Rebate put data
			var sampleRebatePutData = new Rebates({
				_id: '525cf20451979dea2c000001',
				name: 'New Rebate'
			});

			// Mock Rebate in scope
			scope.rebate = sampleRebatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/rebates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rebates/' + sampleRebatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rebateId and remove the Rebate from the scope', inject(function(Rebates) {
			// Create new Rebate object
			var sampleRebate = new Rebates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rebates array and include the Rebate
			scope.rebates = [sampleRebate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/rebates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRebate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rebates.length).toBe(0);
		}));
	});
}());