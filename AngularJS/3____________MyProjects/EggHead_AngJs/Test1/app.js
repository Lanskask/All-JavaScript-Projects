var app = angular.module("expApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/index1", {
            templateUrl: "./pages/index1.html",
            controller: "index1Ctrl"
        })
        .when("/index2", {
            templateUrl: "./pages/index2.html",
            controller: "index2Ctrl"
        })
        .when("/index3", {
            templateUrl: "./pages/index3_oneInstanceBinding.html",
            controller: "index3Ctrl"
        })
        .when("/index4", {
            templateUrl: "./pages/index4_exchangeBeetweenCtrls.html",
            controller: "index4Ctrl"
        })
        .when("/index5", {
            templateUrl: "./pages/index5_filters.html",
            controller: "index5Ctrl"
        })
        .when("/index6", {
            templateUrl: "./pages/index6_directive.html",
            controller: "index6Ctrl"
        })
        .when("/index7", {
            templateUrl: "./pages/index7_mouseOver.html",
            controller: "index7Ctrl"
        });

});
