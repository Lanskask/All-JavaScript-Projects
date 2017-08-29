// main_tests.spec.js

describe('filter', function() {
	beforeEach(module('App1'));

	decribe('reverse', function() {
		it('should reverse a string', inject(function(reverseFilter) {
			expect(reverseFilter('ABCD')).toEqual('DCBA');
			expect(reverseFilter('John')).toEqual('nhoJ');
		}));
	});
});