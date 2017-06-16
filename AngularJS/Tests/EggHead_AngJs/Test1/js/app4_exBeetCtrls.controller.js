app.factory("Data", function () {
	return {
		message: "Message from factory!"
	};
});

app.filter('reverse', function (Data) {
	return function (text) {
		return text.split("").reverse().join("") + Data.message;
	}
})

app.controller('firstCtrl', function($scope, Data){	
	$scope.data = Data;
});

app.controller('secondCtrl', function ($scope, Data) {
	$scope.data = Data;

	var arr = new Array("Яблоко", "Груша", "и т.п.");

	$scope.reversedMessage = function () {
		return $scope.data.message.split("").reverse().join("");
	}

	$scope.reversedMessageWithParam = function (message) {
		return message.split("").reverse().join("");
	}

	$scope.is_an_array = angular.isArray(arr);
	console.log($scope.is_an_array);
	console.log(angular.isArray(arr));

});