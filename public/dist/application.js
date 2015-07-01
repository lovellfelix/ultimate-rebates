'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'ngMaterial'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('affiliates');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('rebates');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('settings');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

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
'use strict';

//Setting up route
angular.module('affiliates').config(['$stateProvider',
	function($stateProvider) {
		// Affiliates state routing
		$stateProvider.
		state('affiliates', {
			abstract: true,
			url: '/affiliates',
			template: '<ui-view/>'
		}).
		state('affiliates.list', {
			url: '',
			templateUrl: 'modules/affiliates/views/list-affiliates.client.view.html'
		}).
		state('affiliates.create', {
			url: '/create',
			templateUrl: 'modules/affiliates/views/create-affiliate.client.view.html'
		}).
		state('affiliates.view', {
			url: '/:affiliateId',
			templateUrl: 'modules/affiliates/views/view-affiliate.client.view.html'
		}).
		state('affiliates.edit', {
			url: '/:affiliateId/edit',
			templateUrl: 'modules/affiliates/views/edit-affiliate.client.view.html'
		});
	}
]);
'use strict';

// Affiliates controller
angular.module('affiliates').controller('AffiliatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Affiliates', 'Rebates',
	function($scope, $stateParams, $location, Authentication, Affiliates, Rebates ) {
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

		// Search for a category
		$scope.affiliateSearch = function(affiliate) {
			$location.path('affiliates/' + affiliate._id);
		};



	}
]);

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
'use strict';

// Configuring the Categories module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Add the Categories dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Categories',
			state: 'categories',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'categories', {
			title: 'List Categories',
			state: 'categories.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'categories', {
			title: 'Create Category',
			state: 'categories.create'
		});
	}
]);
'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('categories', {
			abstract: true,
			url: '/categories',
			template: '<ui-view/>'
		}).
		state('categories.list', {
			url: '',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('categories.create', {
			url: '/create',
			templateUrl: 'modules/categories/views/create-category.client.view.html'
		}).
		state('categories.view', {
			url: '/:categoryId',
			templateUrl: 'modules/categories/views/view-category.client.view.html'
		}).
		state('categories.edit', {
			url: '/:categoryId/edit',
			templateUrl: 'modules/categories/views/edit-category.client.view.html'
		});
	}
]);
'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories ) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function( category ) {
			if ( category ) { category.$remove();

				for (var i in $scope.categories ) {
					if ($scope.categories [i] === category ) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category ;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			});
		};

		// Search for a category
		$scope.categorySearch = function(category) {
			$location.path('categories/' + category._id);
		};
	}
]);

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('api/categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
	function($scope, $state, Authentication, Menus) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision 
        var shouldRender = function(user) {
            if (user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, options) {
            options = options || {};

            // Create the new menu
            this.menus[menuId] = {
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                	this.addSubMenuItem(menuId, options.link, options.items[i]);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, parentItemState, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state|| '',
                        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar', {
            isPublic: false
        });
    }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
    function(Authentication, $state, $timeout) {
    	// Connect to the Socket.io server only when authenticated
        if (Authentication.user) {
            this.socket = io();
        } else {
            $state.go('home');
        }

        // Wrap the Socket.io 'on' method
        this.on = function(eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function(data) {
                    $timeout(function() {
                        callback(data);
                    });
                });
            }
        };

        // Wrap the Socket.io 'emit' method
        this.emit = function(eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        // Wrap the Socket.io 'removeListener' method
        this.removeListener = function(eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);

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

'use strict';

//Setting up route
angular.module('rebates').config(['$stateProvider',
	function($stateProvider) {
		// Rebates state routing
		$stateProvider.
		state('rebates', {
			abstract: true,
			url: '/rebates',
			template: '<ui-view/>'
		}).
		state('rebates.list', {
			url: '',
			templateUrl: 'modules/rebates/views/list-rebates.client.view.html'
		}).
		state('rebates.create', {
			url: '/create',
			templateUrl: 'modules/rebates/views/create-rebate.client.view.html'
		}).
		state('rebates.view', {
			url: '/:rebateId',
			templateUrl: 'modules/rebates/views/view-rebate.client.view.html'
		}).
		state('rebates.edit', {
			url: '/:rebateId/edit',
			templateUrl: 'modules/rebates/views/edit-rebate.client.view.html'
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('settings').config(['$stateProvider',
	function($stateProvider) {
		// Settings state routing
		$stateProvider.
		// state('settings', {
		// 	abstract: true,
		// 	url: '/settings',
		// 	template: '<ui-view/>'
		// }).
		state('settings.list', {
			url: '',
			templateUrl: 'modules/settings/views/list-settings.client.view.html'
		}).
		state('settings.create', {
			url: '/create',
			templateUrl: 'modules/settings/views/create-setting.client.view.html'
		}).
		state('settings.view', {
			url: '/:settingId',
			templateUrl: 'modules/settings/views/view-setting.client.view.html'
		}).
		state('settings.edit', {
			url: '/:settingId/edit',
			templateUrl: 'modules/settings/views/edit-setting.client.view.html'
		});
	}
]);

'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Settings',
	function($scope, $stateParams, $location, Authentication, Settings ) {
		$scope.authentication = Authentication;

		// Create new Setting
		$scope.create = function() {
			// Create new Setting object
			var setting = new Settings ({
				name: this.name
			});

			// Redirect after save
			setting.$save(function(response) {
				$location.path('settings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Setting
		$scope.remove = function( setting ) {
			if ( setting ) { setting.$remove();

				for (var i in $scope.settings ) {
					if ($scope.settings [i] === setting ) {
						$scope.settings.splice(i, 1);
					}
				}
			} else {
				$scope.setting.$remove(function() {
					$location.path('settings');
				});
			}
		};

		// Update existing Setting
		$scope.update = function() {
			var setting = $scope.setting ;

			setting.$update(function() {
				$location.path('settings/' + setting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Settings
		$scope.find = function() {
			$scope.settings = Settings.query();
		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);
'use strict';

//Settings service used to communicate Settings REST endpoints
angular.module('settings').factory('Settings', ['$resource',
	function($resource) {
		return $resource('api/settings/:settingId', { settingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
				return {
					responseError: function (rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('settings', {
				abstract: true,
				url: '/settings',
				templateUrl: 'modules/users/views/settings/settings.client.view.html'
			}).
			state('settings.profile', {
				url: '/profile',
				templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
			}).
			state('settings.password', {
				url: '/password',
				templateUrl: 'modules/users/views/settings/change-password.client.view.html'
			}).
			state('settings.accounts', {
				url: '/accounts',
				templateUrl: 'modules/users/views/settings/manage-social-accounts.client.view.html'
			}).
			state('settings.picture', {
				url: '/picture',
				templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
			}).
			state('authentication', {
				abstract: true,
				url: '/authentication',
				templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
			}).
			state('authentication.signup', {
				url: '/signup',
				templateUrl: 'modules/users/views/authentication/signup.client.view.html'
			}).
			state('authentication.signin', {
				url: '/signin',
				templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			}).
			state('password', {
				abstract: true,
				url: '/password',
				template: '<ui-view/>'
			}).
			state('password.forgot', {
				url: '/forgot',
				templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
			}).
			state('password.reset', {
				abstract: true,
				url: '/reset',
				template: '<ui-view/>'
			}).
			state('password.reset.invalid', {
				url: '/invalid',
				templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
			}).
			state('password.reset.success', {
				url: '/success',
				templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
			}).
			state('password.reset.form', {
				url: '/:token',
				templateUrl: 'modules/users/views/password/reset-password.client.view.html'
			});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/huts');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/huts/create');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/huts');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
	function ($scope, $timeout, $window, Authentication, FileUploader) {
		$scope.user = Authentication.user;
		$scope.imageURL = $scope.user.profileImageURL;

		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: 'api/users/picture'
		});

		// Set file uploader image filter
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.success = true;

			// Populate user object
			$scope.user = Authentication.user = response;

			// Clear upload buttons
			$scope.cancelUpload();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.cancelUpload();

			// Show error message
			$scope.error = response.message;
		};

		// Change user profile picture
		$scope.uploadProfilePicture = function () {
			// Clear messages
			$scope.success = $scope.error = null;

			// Start upload
			$scope.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.cancelUpload = function () {
			$scope.uploader.clearQueue();
			$scope.imageURL = $scope.user.profileImageURL;
		};
	}
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
	function($window) {
		var auth = {
			user: $window.user
		};

		return auth;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
