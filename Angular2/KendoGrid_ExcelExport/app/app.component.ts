import { Component } from '@angular/core';
import { aggregateBy } from '@progress/kendo-data-query';
import { sampleProducts } from './products';
import { ProductService } from './pruducts.service';

@Component({
    selector: 'my-app',
    template: `
        <kendo-grid [kendoGridBinding]="products" [height]="400" [group]="group">
            <ng-template kendoGridToolbarTemplate>
                <button type="button" kendoGridExcelCommand><span class="k-icon k-i-file-excel"></span>Export to Excel</button>
            </ng-template>
            <kendo-grid-column field="ProductID" [locked]="true" title="Product ID" [width]="200">
            </kendo-grid-column>
            <kendo-grid-column field="ProductName" title="Product Name" [width]="350">
            </kendo-grid-column>
            <kendo-grid-column-group title="Availability" [width]="360">
                <kendo-grid-column field="UnitPrice" title="Unit Price" [width]="120">
                    <ng-template kendoGridGroupFooterTemplate let-aggregates>
                        Sum: {{aggregates["UnitPrice"].sum}}
                    </ng-template>
                    <ng-template kendoGridFooterTemplate let-column="column">
                        Total {{column.title}}: {{total["UnitPrice"].sum}}
                    </ng-template>
                </kendo-grid-column>
                <kendo-grid-column field="UnitsOnOrder" title="Units On Order" [width]="120">
                </kendo-grid-column>
                <kendo-grid-column field="UnitsInStock" title="Units In Stock" [width]="120">
                </kendo-grid-column>
            </kendo-grid-column-group>
            <kendo-grid-column field="Discontinued" width="120">
                <ng-template kendoGridGroupHeaderTemplate  let-value="value">
                   Discontinued: {{value}}
                </ng-template>
                <ng-template kendoGridCellTemplate let-dataItem>
                    <input type="checkbox" [checked]="dataItem.Discontinued" disabled/>
                </ng-template>
            </kendo-grid-column>
        <kendo-grid-excel fileName="Products.xlsx"></kendo-grid-excel>
      </kendo-grid>
    `
})
export class AppComponent {
  private products: any;
  
  constructor(private service: ProductService) {
    this.products = this.service.getData();
  }

}