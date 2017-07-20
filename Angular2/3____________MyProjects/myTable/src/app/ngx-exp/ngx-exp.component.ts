import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { GetDataService } from '../services/get-data.service';
import { dsOrder } from "../potso/dsOrder";
import { ttOrder } from "../potso/ttOrder";
import { TtOrderEditDialogComponent } 
  from './tt-order-edit-dialog/tt-order-edit-dialog.component';

@Component({
  selector: 'app-ngx-exp',
  templateUrl: './ngx-exp.component/ngx-exp.component.html',
  styleUrls: ['./ngx-exp.component/ngx-exp.component.css']
})
export class NgxExpComponent implements OnInit {

  // ttOrders: ttOrder[] = [];
  ttOrders: ttOrder[];
  error:any;
  // columns = [{name:'BillToID'},{name:'Carrier'},{name:'Creditcard'},{name:'CustNum'},{name:'Instructions'},{name:'OrderDate'},{name:'OrderStatus'},{name:'Ordernum'},{name:'PO'},{name:'PromiseDate'},{name:'SalesRep'},{name:'ShipDate'},{name:'ShipToID'},{name:'Terms'},{name:'WarehouseNum'}];
  columns = [{prop:'BillToID'},{prop:'Carrier'},{prop:'Creditcard'},{prop:'CustNum'},{prop:'Instructions'}];

  constructor(private _getDataService: GetDataService, public _dialog: MdDialog) { }

  ngOnInit() {
    this._getDataService.getTtOrders()
      .subscribe(
      data => {
        this.ttOrders = data;
        /* console.log("     Log 1. ttOrders in represent-orders-data in success: ");
        console.log(this.ttOrders); */
      },
      error => {
        this.error = error;
        // console.log(error);
      }
      // , () => console.log("Resolved!")
      );
  }

  selected = [];
  ttOrderToEdit: ttOrder;
  ttOrderToTransfer: ttOrder;

  onSelect({ selected }) {
    console.log('Select Event', selected[0], this.selected);
  }

  editTtOrder({ selected }): void { // open dialog on double click.
    console.log('Select Event', this.selected[0]);
    this.ttOrderToTransfer = this.selected[0];
    let ttOrderEditDialogRef = this._dialog.open(TtOrderEditDialogComponent
      , {data: this.ttOrderToTransfer,}
    );    
    ttOrderEditDialogRef.componentInstance.ttOrderToTransfer = this.ttOrderToTransfer;
    // this.ttOrderToEdit = ttOrderEditDialogRef.componentInstance.ttOrderToTransferBack;

    ttOrderEditDialogRef.afterClosed().subscribe(
      // editedTtOrder => this.ttOrderToEdit = editedTtOrder 
      () => {
        this.ttOrderToEdit = ttOrderEditDialogRef.componentInstance.ttOrderToTransferBack;
        this.ttOrderToTransfer = this.ttOrderToEdit;
        console.log("ttOrderToEdit in RepresentOrdersDataComponent: ", this.ttOrderToEdit);
      }
    );
  }

}
