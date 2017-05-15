console.log("text");
var myName = "MyName";
var myAge = 41;
var canVote = true;
var anything = "cat";
anything = 2;
window.onload = function () {
    document.getElementById("tsStuff").
        innerHTML = "My name is " + myName;
};
document.write("canVote is a " + typeof (canVote) + "<br/>");
document.write("myName is a " + typeof (myName) + "<br/>");
document.write("myAge is a " + typeof (myAge) + "<br/>");
document.write("anything is a " + typeof (anything) + "<br/>");
var strToNum = parseInt("5");
var numToStr = 5;
document.write("numToString is a " +
    typeof (numToStr.toString()) + "<br/>");
var PI = 3.14159;
