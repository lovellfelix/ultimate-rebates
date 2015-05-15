'use strict';

describe('Settings E2E Tests:', function() {
	describe('Test Settings page', function() {
		it('Should not include new Settings', function() {
			browser.get('http://localhost:3000/#!/settings');
			expect(element.all(by.repeater('setting in settings')).count()).toEqual(0);
		});
	});
});
