function User(name) {
	this.name = name;
}

User.prototype.hello = function(who) {
	console.log("Hello, " + who.name);
};

// exports.User = User;

global.User = User;