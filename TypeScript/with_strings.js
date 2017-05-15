// with_strings.ts
var multStr = "I go on for a lot of different lines";
document.write(multStr + "<br/>");
document.write("<b> " + multStr + " </b>" + "<br/>");
// --------
function theSum(x, y, z) {
    document.write("Sum: " + (x + y + z) + "<br/>");
}
var argsArr = [3, 4, 5];
theSum.apply(void 0, argsArr);
