import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";


@Component({
    selector: 'demo',
    templateUrl: './app/demo/demo.component.html'
})
export class DemoComponent implements OnInit {

    public data: any; // any added by me
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "email";
    public sortOrder = "asc";

    // --
    public allDsBorder: any;
    public ttOrders: any;
    // --

    private url1 = "app/demo/data.json";
    private url2 = 'http://192.168.0.29:8810/webAppExample/rest/webAppExampleService/beOrder';

    constructor(private http: Http) {
    }

    ngOnInit(): void {
        // this.http.get("app/demo/data.json")
        this.http.get(this.url2)
            .subscribe((data) => {
                setTimeout(() => {
                    // this.data = data.json().dsOrder.ttOrder;
                    // this.data = data._body.dsOrder.ttOrder;
                    this.allDsBorder = data.json();
                    this.ttOrders = this.allDsBorder.dsOrder.ttOrder;
                }, 100);

                console.log(this.data);
            });
            
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

}