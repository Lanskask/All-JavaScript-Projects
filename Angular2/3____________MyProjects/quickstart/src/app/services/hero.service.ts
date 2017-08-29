import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { HEROES } from '../mock-heroes';
import { Hero } from '../hero';

@Injectable()
export class HeroService {
	private heroesUrl = 'api/heroes';

	// getHeroes() {
	// 	return Promise.resolve(HEROES);
	// }

	constructor(private _http: Http) { }

	private headers = new Headers({
		'Content-Type': 'application/json'
	});

	getHeroes(): Promise<Hero[]> {
		return this._http.get(this.heroesUrl)
			.toPromise()
			.then( response => response.json().data as Hero[])
			.catch( this.handleError);
	}

	/* getHero(id: number): Promise<Hero>  {
		return this.getHeroes()
			.then(heroes => heroes.find(hero => hero.id === id));
	} */

	getHero(id: number): Promise<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this._http.get(url)
			.toPromise()
			.then(response => response.json().data as Hero)
			.catch(this.handleError);
	}

	update(hero: Hero): Promise<Hero> {
		const url = `${this.heroesUrl}/${hero.id}`;
		return this._http.put(url, JSON.stringify(hero), 
									{headers: this.headers})
			.toPromise()
			.then( () => hero )
			.catch( this.handleError);
	}

	create(name: string) {
		return this._http
			.post( this.heroesUrl, 
					JSON.stringify({name: name}), 
					{headers: this.headers})
			.toPromise()
			.then( res => res.json().data as Hero)
			.catch(this.handleError);
	}

	delete(id: number): Promise<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this._http.put(url, 
				{ headers: this.headers })
			.toPromise()
			.then( () => null)
			.catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.log('An error occured', error);
		return Promise.reject(error.message || error);
	}
}
