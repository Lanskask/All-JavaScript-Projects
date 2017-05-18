
var log = require('./logger')(module);
var db = require('db');

// For using export in user.js 
// var user = require('./user');
var User = require('./user');

/*function run() {
	var vasya = new user.User("Vasia");
	var petia = new user.User("Petia");

	vasya.hello(petia);
}*/
// For using global in user.js 
// require('./user');

function run() {
	var vasya = new User("Vasia");
	var petia = new User("Petia");

	vasya.hello(petia);

	/*console.*/log(db.getPhrase("Run successful"));
}

if (module.parent) {
	exports.run = run;
} else {
	run();
}

// console.log(module); // info about module