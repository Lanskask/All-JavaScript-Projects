app.directive('superMan', function(){	
	var a = 3;
	var b = 4;
	return {
		restrict: 'A',
		// restrict: 'A',
		// restrict: 'C',
		// restrict: 'M',
		// template: "<div>I save the day.</div>",
		link: function () {
			alert("ALERTTT!!");
		}
	}
});

app.directive('flash', function(){	
	var a = 3;
	var b = 4;
	return {
		restrict: 'A',
		// template: "<div>It is Flash.</div>",
		link: function () {
			alert("Flashhh!!");
		}
	}
});