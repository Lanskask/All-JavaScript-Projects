import { Component } from '@angular/core';
import { aggregateBy } from '@progress/kendo-data-query';
import { GridComponent } from '@progress/kendo-angular-grid';

import { ProductService } from './products.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private products = this.service.getData();
  private gridData: any[];

  constructor(private service: ProductService) {
    // this.products = this.service.getData();
    this.gridData = this.service.getData();
    console.log(this.gridData);
  }

  public exportToExcel(grid: GridComponent): void {
      grid.saveAsExcel();
    }
}
