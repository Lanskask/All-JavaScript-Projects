var someVals = { x: 1, y: 2, z: 3 };
var x = someVals.x, y = someVals.y, z = someVals.z;
document.write(x + y + z + "<br/>");
_a = [z, y, x], x = _a[0], y = _a[1], z = _a[2];
document.write("Switching: " + x + y + z + "<br/>");
document.write("Switching Sum: " + (x + y + z) + "<br/>");
var _a;
