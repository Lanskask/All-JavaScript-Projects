import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../services/get-data.service';
import { MdDialog } from '@angular/material';

import { dsOrder } from "../potso/dsOrder";
import { ttOrder } from "../potso/ttOrder";

import { OpenEditDialogComponent } from '../open-edit-dialog/open-edit-dialog.component';

@Component({
  selector: 'app-represent-orders-data',
  templateUrl: './represent-orders-data.component/represent-orders-data3.component.html',
  styleUrls: ['./represent-orders-data.component/represent-orders-data.component.css']
})
export class RepresentOrdersDataComponent implements OnInit {

  constructor(private _getDataService: GetDataService
    , public _dialog: MdDialog
  ) { }

  ttOrders: ttOrder[] = [];
  error: any;
  ttOrderToEdit: ttOrder;

  editTtOrder(ttOrderToTransfer: ttOrder): void { // open dialog
    let ttOrderEditDialogRef = this._dialog.open(OpenEditDialogComponent
      , {data: ttOrderToTransfer,}
    );    
    ttOrderEditDialogRef.componentInstance.ttOrderToTransfer = ttOrderToTransfer;
    // this.ttOrderToEdit = ttOrderEditDialogRef.componentInstance.ttOrderToTransferBack;

    ttOrderEditDialogRef.afterClosed().subscribe(
      // editedTtOrder => this.ttOrderToEdit = editedTtOrder 
      () => {
        this.ttOrderToEdit = ttOrderEditDialogRef.componentInstance.ttOrderToTransferBack;
        ttOrderToTransfer = this.ttOrderToEdit;
        console.log("   ttOrderToEdit in RepresentOrdersDataComponent: ");
        console.log(this.ttOrderToEdit);
      }
    );
  }

  ngOnInit() {
    this._getDataService.getTtOrders()
      .subscribe(
      data => this.ttOrders = data,
      error => {
        this.error = error; console.log("error: " + error);
      }
      , () => console.log("Data is getted") // TODO: Need only to know if data getteb by observable
      );
  }
}