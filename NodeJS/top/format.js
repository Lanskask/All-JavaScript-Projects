var util = require('util');

var str = util.format("My %s %d %j", "string1", 543, { text: "asf"});

console.log(str);