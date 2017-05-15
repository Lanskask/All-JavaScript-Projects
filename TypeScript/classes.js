var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = (function () {
    function Animal(name, owner) {
        this.name = name;
        this.owner = owner;
        Animal.numOfAnimals++;
    }
    Animal.prototype.ownerInfo = function () {
        document.write(this.name + " is owned by " + this.owner + "<br/>");
    };
    Animal.howManyAnimalsAreCreated = function () {
        return Animal.numOfAnimals;
    };
    Object.defineProperty(Animal.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        set: function (weight) {
            this._weight = weight;
        },
        enumerable: true,
        configurable: true
    });
    Animal.prototype.toString = function () {
        return ("Name: " + this.name + "; Owner: " + this.owner + "; Weight: " + this._weight + "; NumOfAnimals: " + Animal.numOfAnimals + "<br/>");
    };
    return Animal;
}());
Animal.numOfAnimals = 0;
var cat = new Animal("Kitty", "Bob");
cat.ownerInfo();
document.write("Created " + Animal.howManyAnimalsAreCreated() + " animals.<br/>");
cat.weight = 20;
document.write("Cat wheits " + cat.weight + " kg.<br/>");
// -----------
var Dog = (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dog;
}(Animal));
var dog2 = new Dog("Rex", "Raichel");
document.write(cat.toString());
document.write(dog2.toString());
document.write("is dog is an Animal: " + (dog2 instanceof Animal) + "<br/>");
document.write("Does Dog2 has a name: " + ('name' in dog2) + "<br/>");
