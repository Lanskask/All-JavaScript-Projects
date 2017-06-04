var Emotions;
(function (Emotions) {
    Emotions[Emotions["Happy"] = 1] = "Happy";
    Emotions[Emotions["Sad"] = 2] = "Sad";
    Emotions[Emotions["Angry"] = 3] = "Angry";
})(Emotions || (Emotions = {}));
var myFeeling = Emotions.Happy;
document.write("myFeeling: " + myFeeling + "<br/>");
myFeeling = 1;
document.write("myFeeling: " + myFeeling + "<br/>");
