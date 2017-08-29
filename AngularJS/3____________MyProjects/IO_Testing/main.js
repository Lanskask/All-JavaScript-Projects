(function() {

    angular.module("app")
        .controller("MainCtrl", MainCtrl);

    // MainCtrl.$inject = [$http];

    function MainCtrl($http) {
    	var vm = this;

        $http.get('data.json')
            .success(function(result) {
                console.log('success', result)
            })
            .error(function(result) {
                console.log('error');
            })
    };

})();
