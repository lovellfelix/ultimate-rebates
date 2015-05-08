'use strict';

describe('Rebates E2E Tests:', function() {
	describe('Test Rebates page', function() {
		it('Should not include new Rebates', function() {
			browser.get('http://localhost:3000/#!/rebates');
			expect(element.all(by.repeater('rebate in rebates')).count()).toEqual(0);
		});
	});
});
