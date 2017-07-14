import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { BeCheckaService } from './be-checka.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'a2dt',
    templateUrl: './a2dt2.component.html',
})
export class A2DtComponent implements OnInit { 
    public data;
    public filterQuery;
    public rowsOnPage;
    public sortBy = "email";
    public sortOrder = "asc";

    // --
    public allDsOrders: any;
    public ttOrders: any;
    // --

    constructor(
        private _http: Http, 
        private _beCheckaService: BeCheckaService,
    ) { }

    private url1 = "./src/app/a2dt/data.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

    ngOnInit(): void {
        // this.getViaHttpGet();

        // this.printResults();
        console.log('a2dt.component in ngOnInit func.');
        this.getTtOrdersFromServer();
    }

    /* getViaHttpGet() {
        this._http.get(this.url1)
            .subscribe((data) => {
                // this.data = data.json().dsOrder.ttOrder;
                // this.data = data._body.dsOrder.ttOrder;
                this.allDsOrders = data.json();
                // this.ttOrders = this.allDsOrders.dsOrder.ttOrder;
                this.data = this.allDsOrders.dsOrder.ttOrder;
            });
    } */

    printResults(): void {
        console.log("data: " + this.data);
        console.log("allDsOrders: " + this.allDsOrders);
        console.log("ttOrders: " + this.ttOrders);
    }

    /* jsFuncGetHttpData(): void {
        $http.get(this.url1)
        .then(function(result) {
            this.beOrders = result.data.dsOrder.ttOrder;
        });
    } */

    getTtOrdersFromServer2() {
        this.allDsOrders = this._beCheckaService.getTtOrders();
        this.data = this.allDsOrders.json().dsOrder.ttOrder
    }  

    getTtOrdersFromServer() {
        this._beCheckaService.getTtOrders()
            .subscribe(responseData => {
                var stringToParse = responseData._body;
                this.data = JSON.parse(stringToParse).dsOrder.ttOrder;
            });
    }

    
}