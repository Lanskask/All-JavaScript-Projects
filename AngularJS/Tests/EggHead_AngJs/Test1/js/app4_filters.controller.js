
/**
* Factory for Avengers
* @constructor
*/
app.factory('Avengers', function() {
	var Avengers = {};

	Avengers.cast = [
		{
			name: "Klark Kent",
			character: "SuperMan"
		}, 
		{
			name: "Piter Parker",
			character: "SpiderMan"
		}, 
		{
			name: "Bruce Waine",
			character: "BatMan"
		}, 
	];

	return Avengers;
});

// Этот контроллер просто используется для предоставления данных из Avengers (из фабрики) в $scope html файла куда мы вставляем этот контроллер
// Контроллер выдаёт объект, который ему передаётся через функцию-конструктор
// Объект Avengers создаётся в фабрике, кот. называется Avengers
// В этой фабрике создаётся объект Avengers, который возвращается через return
function AvengersCtrl($scope, Avengers) {
	$scope.avengers = Avengers;
};

