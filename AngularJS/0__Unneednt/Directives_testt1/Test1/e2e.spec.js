it('should show off bindings', function() {
	expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text()).toBe('angular');
});