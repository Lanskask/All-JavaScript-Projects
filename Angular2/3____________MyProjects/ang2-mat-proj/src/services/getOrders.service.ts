import { Injectable } from '@angular/core';
import { Component } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class GetOrdersService {

  orders: Array<any>;
  
  url1: string = './allBeOrderData.json';
  url2: string = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

  constructor(private http: Http) {
  	this.http.get(this.url2)
  		.map(response => response.json().dsOrder.ttOrder)
  		.subscribe(res => this.orders = res);
  } 
}
