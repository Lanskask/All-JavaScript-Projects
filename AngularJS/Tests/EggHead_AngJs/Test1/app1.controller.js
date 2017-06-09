app.controller('drink1Ctrl', function($scope){	
// Not Worcking
/*  var vm = this;

	vm.title = "title2";
    function funcStr() {
        return "To PASTE2";
    }*/

	$scope.hello = {
		title: "UserName", 
		/*func: function () {
			return "Some text in drink1Ctrl func1";
		}*/
	}
});

app.controller('secondController', function ($scope) {
	$scope.hello = {
		title: "name2", 
		/*func: function () {
			return "Text in a func in Second controller";
		}*/
	}
});