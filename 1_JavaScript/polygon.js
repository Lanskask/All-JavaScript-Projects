function Polygon(sides) {
	if ( this instanceof Polygon ) {
		this.sides = sides;
		this.getArea = function() {
			return 0;
		};
	} else {
		return new Polygon(sides);
	}
}

function Rectangle (width, height) {
	if ( this instanceof Rectangle ) {
		Polygon.call(this, 2);
		this.width = width;
		this.height = height;
		this.getArea = function() {
			return this.width * this.height ;
		};
	} else {
		return new Rectangle(width, height);
	}

	/*Polygon.call(this, 2);
	this.width = width;
	this.height = height;
	this.getArea = function() {
		return this.width * this.height ;
	};*/
}

var rect = new Rectangle ( 5 , 10 );
alert(rect.sides ); // undefined