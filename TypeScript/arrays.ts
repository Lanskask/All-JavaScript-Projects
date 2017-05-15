var employees: string[] = ["Bob", "Alice", "Sam"];

employees.push("asf");

interface SuperHero {
	realName: String,
	superName: String
}

document.write(employees.toString() +  "<br/>");

var batMan: SuperHero = {
	realName: "Bruce",
	superName: "BatMan"
}

var catWoman: SuperHero = {
	realName: "Felicity",
	superName: "CatWoman"
}

var superheroes: SuperHero[] = [batMan, catWoman];

superheroes.push({
	realName: "Some Mad", 
	superName: "Joker"
})

document.write(superheroes[0].toString() + "<br/>");
