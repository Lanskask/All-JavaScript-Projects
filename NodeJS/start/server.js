/*var user = require('./user.js');

var vasya = new user.User("Vasia");
var petia = new user.User("Petia");*/

require('./user.js');

var vasya = new User("Vasia");
var petia = new User("Petia");

vasya.hello(petia);