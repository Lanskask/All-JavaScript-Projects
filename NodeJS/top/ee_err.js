

var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter;

server.on('error', function (err) {
	console.log(err.status)
});

var err = new Error("server Error");
server.emit('error', err);