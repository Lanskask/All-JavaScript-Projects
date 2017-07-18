import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { dsOrder } from "../potso/dsOrder";
import { ttOrder } from "../potso/ttOrder";

@Injectable()
export class GetDataService {

	url1 = '../../../allBeOrderData.json';
	url2 = "http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder";

	constructor(private _http: Http) { }

	getUsers(): Observable<ttOrder[]> {
		return this._http.get(this.url1)
			.map((resp: Response) => {
				let ttOrdersList = resp.json().dsOrder.ttOrder as ttOrder[];
				// console.log("ttOrdersList in get-data.service" + ttOrdersList);
				console.log("In service.")
				
				return ttOrdersList;
			})
			.catch((error: any) => { return Observable.throw(error); });;
	}
}
