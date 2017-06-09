/*import angular from 'angular'
import styles from './style_myCtrl.css'

var template = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, repellat, molestiae illo quae consectetur provident sunt nemo ipsam dolorum qui, nostrum obcaecati pariatur ab, enim quaerat eveniet ipsum reiciendis molestias!

	<div class="$ctrl.styles.red">should be red</div>
`;

angular
    .module('app', [])
    // .component('myComponent', {
    .component('myCtrl', {
        template: template,
        controller: Controller
    });


function Controller() {

    var vm = this;
    var firstName = "John";
	var lastName = "Doe";

    vm.$onInit = function() {
        vm.styles = styles;
    }
}*/

import styles from 'style_myCtrl.css';

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
// app.controller('myCtrl', function() {
    var vm = this;

	$scope.firstName = "John";
	$scope.lastName = "Doe";

	vm.$onInit = function() {
        vm.styles = styles;
    }
});