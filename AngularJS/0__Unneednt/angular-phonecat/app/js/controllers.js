'use strict';

/* Controllers */
var app = angular.module('allPageApp', []);

app.controller('demoCtrl', function($scope) {
    $scope.name = "World";
    console.log("Console log");
});

// var phonecatApp = angular.module('phonecatApp', []);
// phonecatApp
app.controller('PhoneListCtrl', [ '$scope', '$http', function($scope, $http) {

	$http.get('phones/phones.json').success(
		function(data, status, headers, config) {
			console.log('This is data: ', data, 
				'\n\nThis is Status: ', status,
				'\n\nThis is Headers', headers, 
				'This is config: ', config);

			$scope.phones = data;
		}).error(function() {
			/* Act on the event */
		});

	$scope.title = "Телефоны";
	/*	$scope.phones = [
		{
			'name':'nex 5', 
			'snippet':'Fast tel',
			'status':true, 
			'priority': 1
		},
		{
			'name':'Motr 2', 
			'snippet':'Even faster',
			'status':false, 
			'priority': 4
		},
		{
			'name':'Nokia 5', 
			'snippet':'slow Slow',
			'status':true, 
			'priority': 2
		},
		{
			'name':'Simens', 
			'snippet':'Old very',
			'status': false, 
			'priority': 5
		}
	];*/

	var date = new Date();
	$scope.today = date;

	$scope.doneAndFilter = function (phoneItem) {
		return phoneItem.name && 
				phoneItem.priority > 1 &&
				phoneItem.status === true;
	}

	$scope.sortField = undefined;
	$scope.reverse = false;

	$scope.sort = function (fieldName) {
		if ($scope.sortField === fieldName) {
			$scope.reverse = !$scope.reverse;
		} else {
			$scope.sortField = fieldName;
			$scope.reverse = false;
		}
	}

	$scope.isSortUp = function (fieldName) {
		return $scope.sortField === fieldName && !$scope.reverse;
	}

	$scope.isSortDown = function (fieldName) {
		return $scope.sortField === fieldName && $scope.reverse;
	}
}]);

/*// To input all controller is sersver's scope view 
// Way 1
function PhoneListCtrl($scope, $http) {...};
PhoneListCtrl.$inject = ['$scope', '$http'];
phonecatApp.controller('PhoneListCtrl', PhoneListCtrl);

// Way 2
function PhoneListCtrl($scope, $http) {...};
phonecatApp.controller('PhoneListCtrl', 
	[ '$scope', '$http', PhoneListCtrl]);*/