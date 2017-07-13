import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
    selector: 'hero-search',
    templateUrl: './hero-search.component',
    styleUrls: ['./hero-search.component'],
    providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
    heroes: Observable<Hero[]>;
    private searchTerms = new Subject<string>();

    constructor(
        private _heroSearchService: HeroSearchService,
        private _router: Router
    ) { }

    search(term: string): void {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.heroes = this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap( term => term // switch to new observable each time the term changes
                        // return the http search observable
                        ? this._heroSearchService.search(term)
                        // or the observable of empty heroes if there was no search term
                        : Observable.of<Hero[]>([])
            )
            .catch( error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<Hero[]>([]);
            })
    } 

    gotoDetail(hero: Hero) {
        let link = ['/detail', hero.id];
        this._router.navigate(link);
    }
}