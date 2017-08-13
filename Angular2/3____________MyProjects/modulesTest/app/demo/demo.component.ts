import {Component} from "@angular/core";
import {Http} from "@angular/http";

@Component({
    selector: 'demo',
    templateUrl: './app/demo/demo.component.html'
})
export class DemoComponent implements OnInit {

    public data;
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "email";
    public sortOrder = "asc";

    constructor(private http: Http) {
    }

    ngOnInit(): void {
        this.http.get("app/demo/data.json")
            .subscribe((data)=> {
                setTimeout(()=> {
                    this.data = data.json();
                }, 1000);
            });
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }
  
}