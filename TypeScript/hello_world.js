var myName = "String1";
var myAge = 5;
var canDo = true;
var anything = false;
anything = 2;
console.log(myName + " " + myAge);
console.log(canDo + " " + anything);
window.onload = function () {
    var newString = "Ma name is " + myName;
    document.getElementById("tsStuff").innerHTML = newString;
};
document.write("myname is a " + typeof (myName) + "<br />");
document.write("canDo is a " + typeof (canDo) + "<br />");
document.write("anything is a " + typeof (anything) + "<br />");
// --------------
var Car = (function () {
    function Car() {
        this.wheels = 4;
    }
    Car.prototype.drive = function () {
        console.log("Car is driving");
    };
    return Car;
}());
var myCar = new Car();
myCar.drive();
var Car2 = (function () {
    function Car2(mph) {
        this.speed = mph;
    }
    Car2.prototype.getSpeed = function () {
        return this.speed;
    };
    return Car2;
}());
var car2 = new Car2(70);
console.log(car2.getSpeed());
// --------------
