
var EventEmitter = require('events').EventEmitter;

var db = new EventEmitter();
db.setMaxListenners(0);


function Request() {
	var self = this;

	this.bigData = new Array(1e6).join("*");

	this.send = function(data) {
		console.log(data);
	};

	this.onError = function() {
		self.send("Sorry, we have a problem!");
	};

	/*db.on('data', function(info) {
		self.send(info);
	}); */

	function onData(info) {
		self.send(info);
	}

	this.end = function () {
		db.removeListener('data', onData);
	}

	db.on('data', onData);
}

setInterval(function () {
	// heapdump - для анализа данных (использования данных, памяти программы) в Chrome
	var request = new Request();
	// ...
	request.end();
	console.log(process.memoryUsage().heapUsed);
	console.log(db);
}, 200 );