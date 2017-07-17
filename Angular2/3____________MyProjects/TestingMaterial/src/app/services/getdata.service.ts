import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { dsOrder } from '../potso/dsOrder'

@Injectable()
export class GetDataService {

    private url1 = "./allBeOrderData.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

    public allDsOrder: dsOrder;

    constructor(private _http: Http) {
        this.getTtOrders()
            .subscribe(
                data => this.allDsOrder = data, 
                error => console.log(error)
            );
    }

    /* public getJSON(): Observable<any> {
        return this._http.get(this.url1)
            .map((res: any) => res.json())
            .catch(
                console.log("It's a error!")
                //  (error: any) => console.log(error) 
            );
    } */

    getTtOrders(): Observable<any> {
		return this._http.get(this.url1)
			.map( (response: Response) => response.json());
	}

    /* getTtOrders2() {
        return this._http.get(this.url2)
                        .toPromise()
                        .then(
							// this.extractData
							response => response.json()._body
						)
                        .catch(this.handleError);
	} */

    /* private extractData(res: Response) {
        return res.json();
	}
	
	private handleError(error: any) {
        console.error("it's a error"); // log to console instead		
    } */

}
