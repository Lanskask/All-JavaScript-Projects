import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	homeTitle = "It's a Home Title";
	myString = "i like someth";
	myBoolean = true;
	ninja = {
		name: "Mayoshy Xo",
		belt: "red"
	}


	alertMe(val) {
		alert(val);
	}

  constructor() { }

  ngOnInit() {
  }

}
