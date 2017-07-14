import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { dsOrder } from './dsOrder';
import { ttOrder } from './ttOrder';

@Injectable()
export class BeCheckaService {
    // TODO: What should be here?
	private ttOrdersUrl = 'api/ttOrder'; //'api/heroes'; 

	// getHeroes() {
	// 	return Promise.resolve(HEROES);
	// }

	constructor(private _http: Http) { }

	 getTtOrders(): Promise<ttOrder[]> {
		return this._http.get(this.ttOrdersUrl)
			.toPromise()
			.then( response => response.json().dsOrder.ttOrder as ttOrder[])
			.catch( this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.log('An error occured', error);
		return Promise.reject(error.message || error);
	}

	getTtOrder(BillToID: number): Promise<ttOrder>  {
		return this.getTtOrders()
			.then(ttOrders => ttOrders.find(ttOrder => ttOrder.BillToID === BillToID));
	}  
}
