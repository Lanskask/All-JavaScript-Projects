import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { dsOrder } from './dsOrder';
import { ttOrder } from './ttOrder';

@Injectable()
export class BeCheckaService {
	private ttOrdersUrl = 'api/ttOrder'; //'api/heroes'; 
	
	private url1 = "./src/app/a2dt/data.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';


	constructor(private _http: Http) { }

	/* getTtOrders() {
		// let result = this._http.get(this.url2).map(res => res.json());
		// this._http.get(this.url2).map(res => result = res.json());

		return this._http.get(this.url2).toPromise()
			.then(
				response => response.json()._body.json().dsOrder.ttOrder				
			);
			// .catch(console.log("It's a error in Log1"));

			// .map( res => {
			// 	res.json()._body.json().dsOrder.ttOrder; 
			// 	console.log(res.json()._body.dsOrder.ttOrder);
			// } )
			// //...errors if any
			// .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	} */

	getTtOrders2() {
        return this._http.get(this.url2)
                        .toPromise()
                        .then(
							// this.extractData
							response => response.json()._body
						)
                        .catch(this.handleError);
	}

	getTtOrders() {
		return this._http.get(this.url2)
			.map( (response: Response) => response.json());
	}

    private extractData(res: Response) {
        return res.json();
	}
	
	private handleError(error: any) {
        /* let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
		return Promise.reject(errMsg); */
        console.error("it's a error"); // log to console instead		
    }
					
}
