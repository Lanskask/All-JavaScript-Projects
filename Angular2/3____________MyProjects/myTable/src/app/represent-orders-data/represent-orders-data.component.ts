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
  defaultPageToShow: number = 10;
  displayedColumns = [
    "BillToID", "Carrier", "Creditcard", "CustNum",
    /* "Instructions", "OrderDate", "OrderStatus", "Ordernum", 
    "PO", "PromiseDate", "SalesRep", "ShipDate", 
    "ShipToID", "Terms", "WarehouseNum",  */
  ];
  ttOrderToEdit: ttOrder;

  editTtOrder(ttOrderToEdit: ttOrder): void { // open dialog
    // this._dialog.open(OpenEditDialogComponent);
    let dialogRef = this._dialog.open(OpenEditDialogComponent, {
      data: ttOrderToEdit,
    });
    dialogRef.afterClosed().subscribe(editedTtOrder => {
      this.ttOrderToEdit = editedTtOrder;
    });
    // console.log("Table row is double clicked!");
  }

  ngOnInit() {
    this._getDataService.getUsers()
      .subscribe(
      data => this.ttOrders = data,
      error => {
        this.error = error; console.log("error: " + error);
      }
      // , () => console.log("Data is getted") // TODO: Need only to know if data getteb by observable
      );
  }
}