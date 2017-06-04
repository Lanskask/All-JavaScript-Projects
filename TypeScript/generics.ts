function GetType<T>(val: T): string {
	return typeof(val) + "<br/>";
}

var aStr = "S String";
var aNum = 5;

document.write("Type of aStr: " + GetType(aStr));
document.write("Type of aNum: " + GetType(aNum));