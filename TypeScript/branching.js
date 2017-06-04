var samLet = 123;
if (true) {
    var samLet_1 = 456;
}
document.write("samlet = " + samLet + "<br/>");
var samLet2 = 123;
if (true) {
    var samLet2 = 456;
}
document.write("samlet = " + samLet2 + "<br/>");
var someArray = [3, 4, 5, 6];
for (var _i = 0, someArray_1 = someArray; _i < someArray_1.length; _i++) {
    var num = someArray_1[_i];
    document.write(num + ', ');
}
document.write("<br/>");
var someStrArray = someArray.map(String);
for (var _a = 0, someStrArray_1 = someStrArray; _a < someStrArray_1.length; _a++) {
    var strNum = someStrArray_1[_a];
    document.write(strNum + ', ');
}
document.write("<br/>");
