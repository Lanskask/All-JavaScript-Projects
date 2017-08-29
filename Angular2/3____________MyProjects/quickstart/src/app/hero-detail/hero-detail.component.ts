import 'rxjs/add/operator/switchMap';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../services/hero.service';

@Component({
	selector: 'hero-detail',
	templateUrl: './hero-detail.component.html',
})
export class HeroDetailComponent implements OnInit {
	// @Input()
	hero: Hero;

	constructor(
		private _heroService: HeroService,
		private _activatedRoute: ActivatedRoute,
		private _location: Location
	) {}

	ngOnInit(): void {
		this.activatedRouteSwitchmap();
	}

	activatedRouteSwitchmap() {
		this._activatedRoute.paramMap
			.switchMap((params: ParamMap) => 
				this._heroService.getHero(+params.get('id')))
			.subscribe(hero => this.hero = hero);
	}

	goBack(): void {
		this._location.back();
	}

	save(): void {
		this._heroService.update(this.hero)
			.then( () => this.goBack());
	}
}