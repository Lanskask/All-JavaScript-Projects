import { Component } from "@angular/core";
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // spaceScreens: Array<any>;

  /*constructor(private http:Http) {
  	// this.http.get('./data.json')
  	this.http.get('src/data.json')
  		.map(response => response.json().screenshots)
  		.subscribe(res => this.spaceScreens = res);
  }*/

  orders: Array<any>;

  constructor(private http:Http) {
  	this.http.get('http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder')
  		.map(response => response.json().dsOrder.ttOrder)
  		.subscribe(res => this.orders = res);
  }
}
