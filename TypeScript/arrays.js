var employees = ["Bob", "Alice", "Sam"];
employees.push("asf");
document.write(employees.toString() + "<br/>");
var batMan = {
    realName: "Bruce",
    superName: "BatMan"
};
var catWoman = {
    realName: "Felicity",
    superName: "CatWoman"
};
var superheroes = [batMan, catWoman];
superheroes.push({
    realName: "Some Mad",
    superName: "Joker"
});
document.write(superheroes[0].toString() + "<br/>");
