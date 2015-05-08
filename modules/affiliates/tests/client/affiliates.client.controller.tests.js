'use strict';

(function() {
	// Affiliates Controller Spec
	describe('Affiliates Controller Tests', function() {
		// Initialize global variables
		var AffiliatesController,
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

			// Initialize the Affiliates controller.
			AffiliatesController = $controller('AffiliatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Affiliate object fetched from XHR', inject(function(Affiliates) {
			// Create sample Affiliate using the Affiliates service
			var sampleAffiliate = new Affiliates({
				name: 'New Affiliate'
			});

			// Create a sample Affiliates array that includes the new Affiliate
			var sampleAffiliates = [sampleAffiliate];

			// Set GET response
			$httpBackend.expectGET('api/affiliates').respond(sampleAffiliates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.affiliates).toEqualData(sampleAffiliates);
		}));

		it('$scope.findOne() should create an array with one Affiliate object fetched from XHR using a affiliateId URL parameter', inject(function(Affiliates) {
			// Define a sample Affiliate object
			var sampleAffiliate = new Affiliates({
				name: 'New Affiliate'
			});

			// Set the URL parameter
			$stateParams.affiliateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/affiliates\/([0-9a-fA-F]{24})$/).respond(sampleAffiliate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.affiliate).toEqualData(sampleAffiliate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Affiliates) {
			// Create a sample Affiliate object
			var sampleAffiliatePostData = new Affiliates({
				name: 'New Affiliate'
			});

			// Create a sample Affiliate response
			var sampleAffiliateResponse = new Affiliates({
				_id: '525cf20451979dea2c000001',
				name: 'New Affiliate'
			});

			// Fixture mock form input values
			scope.name = 'New Affiliate';

			// Set POST response
			$httpBackend.expectPOST('api/affiliates', sampleAffiliatePostData).respond(sampleAffiliateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Affiliate was created
			expect($location.path()).toBe('/affiliates/' + sampleAffiliateResponse._id);
		}));

		it('$scope.update() should update a valid Affiliate', inject(function(Affiliates) {
			// Define a sample Affiliate put data
			var sampleAffiliatePutData = new Affiliates({
				_id: '525cf20451979dea2c000001',
				name: 'New Affiliate'
			});

			// Mock Affiliate in scope
			scope.affiliate = sampleAffiliatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/affiliates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/affiliates/' + sampleAffiliatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid affiliateId and remove the Affiliate from the scope', inject(function(Affiliates) {
			// Create new Affiliate object
			var sampleAffiliate = new Affiliates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Affiliates array and include the Affiliate
			scope.affiliates = [sampleAffiliate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/affiliates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAffiliate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.affiliates.length).toBe(0);
		}));
	});
}());