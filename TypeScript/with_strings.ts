// with_strings.ts

var multStr = `I go on for a lot of different lines`;

document.write(multStr + "<br/>");

document.write(`<b> ${multStr} </b>`  + "<br/>");

// --------
function theSum(x: number, y: number, z: number): void {
	document.write("Sum: " + (x+ y + z) + "<br/>");
}

var argsArr: number[] = [3, 4, 5];

theSum(...argsArr);