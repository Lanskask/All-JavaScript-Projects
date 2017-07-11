import {Component} from '@angular/core';
import {Hero} from './hero';
import {HeroService} from './hero.service';
import {OnInit} from '@angular/core';

@Component({
    selector: 'my-heroes',
    templateUrl: 'heroes.component.html',
    inputs: [`parentData`],
    styleUrls: [ 'heroes.component.css' ],
})
export class HeroesComponent implements OnInit {
    heroes:Hero[];
    selectedHero:Hero;

    constructor(private _heroService:HeroService) {
    }

    ngOnInit():void {
        this.getHeroes();
    }

    getHeroes() {
        this._heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

    onSelect(hero:Hero) {
        this.selectedHero = hero;
    }
		
}