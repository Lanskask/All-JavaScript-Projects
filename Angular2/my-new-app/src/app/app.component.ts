// import { NgModule } from '@angular/core';
import { Component } from '@angular/core';

export class Hero {
	id: number;
	name: string;

  add = function(a: number, b: number): number  {
   return a + b;
  }
}

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `<h1>{{title}}</h1>
  					<h2>{{hero.name}}</h2>
  					<div>
  						<label>id: </label>{{hero.id}}
  					</div>
  					<div>
  						<label>name: </label>
  						<input [(ngModel)]="hero.name" placeholder="hero's name">
  						<p>Sum 4 + 3: {{add(4, 3)}}</p>
  					</div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  // hero = "Windstrom";

  hero: Hero = {
  	id: 1,
  	name: "Windstorm"
  };


  /*left: number;
  right: number;

  constructor(left: number, right: number) {
  	this.left = left;
  	this.right = right;
  }

  add(left: number, right: number): number {
  	return left + right;
  }

  add_this(): number {
  	return this.left + this.right;
  }

  result: number = this.add(3, 5);*/

}
