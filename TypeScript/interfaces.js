var Car = (function () {
    function Car(wheel) {
        this.wheel = wheel;
    }
    Car.prototype.drive = function () {
        document.write("Car has " + this.wheel + " wheels<br/>");
    };
    return Car;
}());
var Bicycle = (function () {
    function Bicycle(wheel) {
        this.wheel = wheel;
    }
    Bicycle.prototype.drive = function () {
        document.write("Bicycle has " + this.wheel + " wheels<br/>");
    };
    return Bicycle;
}());
var car1 = new Car(4);
var bike1 = new Bicycle(2);
car1.drive();
bike1.drive();
function GetWheel(veh) {
    return veh.drive();
}
GetWheel(car1);
GetWheel(bike1);
