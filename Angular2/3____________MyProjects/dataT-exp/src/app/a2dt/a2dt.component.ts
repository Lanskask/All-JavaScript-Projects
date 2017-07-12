import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'a2dt',
    templateUrl: './a2dt.component.html',
})
export class A2DtComponent implements OnInit { 
    public data;
    public filterQuery;
    public rowOnpage;
    public sortBy = "email";
    public sortOrder = "asc";

    // --
    public allDsBorder: any;
    public ttOrders: any;
    // --

    constructor(private _http: Http) { }

    private url1 = "./src/app/a2dt/data.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

    ngOnInit(): void {
        // this.getViaHttpGet();

        // this.printResults();
    }

    // getViaHttpGet() {
    //     this._http.get(this.url1)
    //         .subscribe((data) => {
    //             // this.data = data.json().dsOrder.ttOrder;
    //             // this.data = data._body.dsOrder.ttOrder;
    //             this.allDsBorder = data.json();
    //             // this.ttOrders = this.allDsBorder.dsOrder.ttOrder;
    //             this.data = this.allDsBorder.dsOrder.ttOrder;
    //         });
    // }

    printResults(): void {
        console.log("data: " + this.data);
        console.log("allDsBorder: " + this.allDsBorder);
        console.log("ttOrders: " + this.ttOrders);
    }

    // jsFuncGetHttpData(): void {
    //     $http.get(this.url1)
    //     .then(function(result) {
    //         this.beOrders = result.data.dsOrder.ttOrder;
    //     });
    // }

    
}