class Animal {
	public forFood: string;

	static numOfAnimals: number = 0;

	constructor(private name: string, private owner: string) {
		Animal.numOfAnimals++;
	}

	ownerInfo() {
		document.write(this.name + " is owned by " + this.owner + "<br/>");
	}

	static howManyAnimalsAreCreated(): number {
		return Animal.numOfAnimals;
	}

	private _weight: number;

	get weight(): number {
		return this._weight;
	}

	set weight(weight: number) {
		this._weight = weight;
	}

	toString(): string {
		return ("Name: " + this.name + "; Owner: " + this.owner + "; Weight: " + this._weight + "; NumOfAnimals: " + Animal.numOfAnimals + "<br/>");
	}
}

var cat: Animal = new Animal("Kitty", "Bob");

cat.ownerInfo();

document.write("Created " + Animal.howManyAnimalsAreCreated() + " animals.<br/>");

cat.weight = 20;

document.write("Cat wheits " + cat.weight + " kg.<br/>");


// -----------
class Dog extends Animal {
	
}

var dog2 = new Dog("Rex", "Raichel");

document.write(cat.toString());
document.write(dog2.toString());

document.write("is dog is an Animal: " + (dog2 instanceof Animal) + "<br/>");

document.write("Does Dog2 has a name: " + ('name' in dog2) + "<br/>");

