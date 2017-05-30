console.log("text");

var myName: string = "MyName";
var myAge: number = 41;
var canVote: boolean = true;
var anything: any = "cat";
anything = 2;

window.onload = function() {
	document.getElementById("tsStuff").
		innerHTML = "My name is " + myName;
}

document.write("canVote is a " + typeof(canVote) + "<br/>");
document.write("myName is a " + typeof(myName) + "<br/>");
document.write("myAge is a " + typeof(myAge) + "<br/>");
document.write("anything is a " + typeof(anything) + "<br/>");

var strToNum: number = parseInt("5");
var numToStr: number = 5;

document.write("numToString is a " + 
	typeof(numToStr.toString()) + "<br/>");

const PI = 3.14159;