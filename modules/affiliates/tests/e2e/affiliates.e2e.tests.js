'use strict';

describe('Affiliates E2E Tests:', function() {
	describe('Test Affiliates page', function() {
		it('Should not include new Affiliates', function() {
			browser.get('http://localhost:3000/#!/affiliates');
			expect(element.all(by.repeater('affiliate in affiliates')).count()).toEqual(0);
		});
	});
});
