var myApp = angular.module('myApp', []);
myApp.controller('myController', function() {
    this.message = "myController";
    this.text = "Контроллер без $scope";
});