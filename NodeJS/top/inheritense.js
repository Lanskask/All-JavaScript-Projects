var util = require('util');

// ------ Parent -----
function Animal(name) {
	this.name = name;
}

Animal.prototype.walk = function(){
	console.log("Ходит " + this.name);
};

// ---- Child ------
function Rabbit(name) {
	this.name = name;
}

util.inherits(Rabbit, Animal);

Rabbit.prototype.jump = function(){
	console.log("Прыгает " + this.name
		);
};

// -------- Using -----
var rabbit = new Rabbit("Зайчик Белок");
rabbit.walk();
rabbit.jump();