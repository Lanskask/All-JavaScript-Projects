var someVals = { x: 1, y: 2, z: 3};

var {x, y, z} = someVals;

document.write(x + y + z + "<br/>");

[x, y, z] = [z, y, x];

document.write("Switching: " + x + y + z + "<br/>");
document.write("Switching Sum: " + (x + y + z) + "<br/>");

