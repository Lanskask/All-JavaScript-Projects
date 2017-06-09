var myName: string = "String1";
var myAge: number = 5;
var canDo: boolean = true;
var anything: any = false;
anything = 2;

console.log(myName + " " + myAge);
console.log(canDo + " " + anything);

window.onload = function() {
  var newString: string = "Ma name is " + myName;
  document.getElementById("tsStuff").innerHTML =  newString;
}

document.write("myname is a " + typeof(myName) + "<br />");
document.write("canDo is a " + typeof(canDo) + "<br />");
document.write("anything is a " + typeof(anything) + "<br />");

// --------------
class Car {
  wheels: number = 4;
  drive() {
    console.log("Car is driving");
  }
}

var myCar: Car = new Car();
myCar.drive();

class Car2 {
  speed: number;

  constructor(mph: number ) {
    this.speed = mph;
  }

  getSpeed(): number {
    return this.speed;
  }
}

var car2: Car2 = new Car2(70);
console.log(car2.getSpeed());
// --------------
