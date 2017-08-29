import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { GetDataService } from './services/getdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

  // orders: Array<any>;
  ordersSubscr;
  orders;
  
  url1: string = './allBeOrderData.json';
  url2: string = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

  constructor(private http: Http, private _getDataService: GetDataService) {
  	/* this.http.get(this.url2)
  		.map(response => response.json().dsOrder.ttOrder)
      .subscribe(res => this.orders = res);
      console.log("Orders:" + this.orders); */
      /* this.ordersSubscr =  */
        this._getDataService.getTtOrders().subscribe(
                data => this.orders = data.dsOrder.ttOrder, 
                error => console.log(error)
            );
      // this.orders = this.ordersSubscr.dsOrder.ttOrder;

  } 
  
}
