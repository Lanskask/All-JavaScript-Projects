// test3.directive.js

var app = angular.module('app');

/*app.directive('test3', function() {
	return function( scope, element, attrs) {
		console.log('<h3>This is my directive</h3>');
	}
});*/

app.directive('test3', function() {
	return {
		link: function( scope, element, attrs) {
			console.log('<h3>222 This is my directive</h3>');
			console.log('scope', scope);
			console.log('element', element);
			console.log('attrs', attrs);
			element.text("Text inside elemnt.text.!!..")
		}
	}
});