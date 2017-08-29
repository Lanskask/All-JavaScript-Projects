import { Component, OnInit } from "@angular/core";
import { Http } from '@angular/http';

import { GetOrdersService } from '../services/getOrders.service' ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component/app.component.html',
  styleUrls: ['./app.component/app.component.css']
})
export class AppComponent {

  orders: Array<any>;
  
  url1: string = './allBeOrderData.json';
  url2: string = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

  constructor(private http: Http) {
  	this.http.get(this.url2)
  		.map(response => response.json().dsOrder.ttOrder)
  		.subscribe(res => this.orders = res);
  } 
}