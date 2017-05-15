interface Vehicle {
	drive(): any;
}

class Car implements Vehicle {
	constructor(private wheel: number) {}

	drive(): void {
		document.write("Car has " + this.wheel + " wheels<br/>");
	}
}

class Bicycle implements Vehicle {
	constructor(private wheel: number) {}

	drive(): void {
		document.write("Bicycle has " + this.wheel + " wheels<br/>");
	}
}

var car1 = new Car(4);
var bike1 = new Bicycle(2);

car1.drive();
bike1.drive();

function GetWheel<w extends Vehicle> (veh: w) {
	return veh.drive();
}

GetWheel(car1);
GetWheel(bike1);