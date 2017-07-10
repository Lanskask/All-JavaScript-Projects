import { Component } from '@angular/core';
import { HeroService } from './hero.service';
import { HeroesComponent } from './heroes.component';

@Component({
	selector: 'my-app',
	template: `<h1>{{title}}</h1>
				<nav>
					<a routerLink="/">Home</a>
					<a routerLink="/dashboard">Dashboard</a>
					<a routerLink="/heroes">Heroes</a>
				</nav>
				<router-outlet></router-outlet>`,
	directives: [ HeroesComponent ],
	providers: [ HeroService ],
})
export class AppComponent {
	title = "Tour of Heroes";
}