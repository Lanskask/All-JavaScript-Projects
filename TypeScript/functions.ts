
var numbers: number[] = [4, 9, 16, 25];

window.onload = function() {
	document.getElementById("w3sc_demo").innerHTML = numbers.map(Math.sqrt).toString();
}

// ---------
var sumAll = function(...nums: number[]): void {
	var sum = nums.reduce( (a, b) => a + b, 0);

	document.write("Sum:" + sum + "<br/>");
}

sumAll(1, 2, 3, 4, 5);
// --------------

var addOne = (x) => x + 1;
document.write("AddOne to 2  = " + addOne(2) + "<br/>");
// --------------
var getSum = function(num1: number, num2: number): number {
	let sum = num1 + num2;
	return sum;
}

var theSum1: number = getSum(3, 5);

document.write("getSum(3, 5) = " + theSum1 + "<br/>");

var str1: String = "The fee is " + ((5>4) ? "5>4" : "5<4");

document.write(str1 + "<br/>");

// --------------
var getDiff = function(num1: number, num2 = 2, num3?: number): number {
	let answer: number;
	if(typeof num3 !== 'undefined') {
		answer = num1 - num2 - num3;
	} else {
		answer = num1 - num2;
	}
	return answer;
}

document.write("getDiff(2, 1, 1): " + getDiff(2, 1, 1) + "<br/>");
document.write("getDiff(2, 1): " + getDiff(2, 1) + "<br/>");
document.write("getDiff(2, num2 = 2 (default)): " + getDiff(2) + "<br/>");
