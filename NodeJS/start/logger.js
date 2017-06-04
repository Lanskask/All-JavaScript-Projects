module.exports = function (module) {
	
	return function (/*argument*/) {
		var args = [module.filename].concat([].slice.call(arguments));
		console.log.apply(console, args);
	}
}