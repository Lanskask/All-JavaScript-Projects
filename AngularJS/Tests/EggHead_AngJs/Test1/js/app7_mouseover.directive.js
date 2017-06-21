var app = angular.module("behaviorApp", []);

app.directive("enter", function(scope, element) {
	element.bind("mouseenter", function() {
		console.log("Mouse is over the directive area!");
	});
});

app.directive("leave", function(scope, element) {
	element.bind("mouseleave", function() {
		console.log("Goodby, little Mouse!");
	});
});