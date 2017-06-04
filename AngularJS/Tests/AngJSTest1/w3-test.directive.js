var app = angular.module('app', []);

app.directive("w3testdirective", function() {
    return {
        template : "<h1>Made by a directive!</h1>"
    };
});