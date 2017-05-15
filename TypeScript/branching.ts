let samLet = 123;
if(true) {
	let samLet = 456;
}
document.write("samlet = " + samLet + "<br/>");

var samLet2 = 123;
if(true) {
	var samLet2 = 456;
}
document.write("samlet = " + samLet2 + "<br/>");

var someArray = [3,4,5,6];
for (var num of someArray) {
	document.write(num + ', ');
}
document.write("<br/>");

var someStrArray = someArray.map(String);
for (var strNum of someStrArray) {
	document.write(strNum + ', ');
}
document.write("<br/>");

