class GenericNumber<T> {
	add: (val1: T, val2: T) => T;
}

var aNumber = new GenericNumber<number>();

aNumber.add = function(x, y) {
	return x + y;
}

document.write("aNumber.add(5, 4): " + aNumber.add(5, 4) + "<br/>");

// ------------ For Strings ------


var aString = new GenericNumber<string>();

// --- To Concatenate
/*aString.add = function(x, y) {
	return x + y;
}*/

aString.add = function(x, y) {
	return String(Number(x) + Number(y));
}

document.write("aString.add(5, 4): " + aString.add("5", "4") + "<br/>");