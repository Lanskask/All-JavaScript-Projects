import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { dsOrder } from './dsOrder';
import { ttOrder } from './ttOrder';

@Injectable()
export class BeCheckaService {
    // TODO: What should be here?
	private ttOrdersUrl = 'api/ttOrder'; //'api/heroes'; 
	
	private url1 = "./src/app/a2dt/data.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';
	// getHeroes() {
	// 	return Promise.resolve(HEROES);
	// }

	constructor(private _http: Http) { }

	// getTtOrders(): Promise<ttOrder[]> {
	/* getTtOrders3() {
		// return this._http.get(this.url1)
		return this._http.get(this.url2)
			.toPromise()
			.then( 
				response => response.json()._body.dsOrder.ttOrder
				// this.extractData
			) // as ttOrder[])
			.catch( this.handleError );
	}  */
	
/* 	getTtOrders(): Observable<ttOrder[]> {
		return this._http.get(this.url2)
			.map( res => {
				res.json()._body.dsOrder.ttOrder; 
				console.log(res.json()._body.dsOrder.ttOrder);
			} )
			//...errors if any
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	} */
	
	getTtOrders() {
		// let result = this._http.get(this.url2).map(res => res.json());
		let result;

		// this._http.get(this.url2).map(res => result = res.json());

		return this._http.get(this.url2).toPromise()
			.then(
				response => response.json()._body.json().dsOrder.ttOrder				
			);
			// .catch(console.log("It's a error in Log1"));

			/* .map( res => {
				res.json()._body.json().dsOrder.ttOrder; 
				console.log(res.json()._body.dsOrder.ttOrder);
			} )
			//...errors if any
			.catch((error: any) => Observable.throw(error.json().error || 'Server error')); */
	}

	/* getTtOrders(): Observable<ttOrder[]> {
		return this._http.get(this.url2)
						.map(this.extractData)
						.catch(this.handleError);
	} */
	/* private extractData(res: Response) {
		let body = res.json();
		return body.data || { };
	}  */
	/* private extractData(res: Response) {
		// let body = res.json();
		// return res.json(JSON.stringify(data)).data || { };
		return res.json() || { };
	}
	private extractData2(responseData) {
		let startIndex = 0;
		let itemsPerPage = 15;

		console.log("log1 ");
		return responseData._data.json().dsOrder.ttOrder
			.slise(startIndex, startIndex + itemsPerPage);
	} */

/* 	private handleError(error: any): Promise<any> {
		console.log('An error occured', error);
		return Promise.reject(error.message || error);
	} */

	/* getTtOrder(BillToID: number): Promise<ttOrder>  {
		return this.getTtOrders()
			.then(ttOrders => ttOrders.find(ttOrder => ttOrder.BillToID === BillToID));
	}   */

	/* private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		 let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			// const err = _body.error || JSON.stringify(body);
			const err = JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		console.log("It's a error!");
		return Observable.throw(errMsg); 
	} */

}
