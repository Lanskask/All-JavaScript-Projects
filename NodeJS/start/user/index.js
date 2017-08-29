
var db = require('db');
db.connect(); // make function in db/index.js 
// This function loads data from ru.json, ehich is in db-folder

function User(name) {
	this.name = name;
}

User.prototype.hello = function(who) {
	// console.log( phrases.Hello + ", " + who.name);
	console.log( db.getPhrase("Hello") + ", " + who.name);
};

exports.User = User; // or module.exports. or this. 
// global.User = User;
module.exports = User;