import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../services/get-data.service';

import { dsOrder } from "../potso/dsOrder";
import { ttOrder } from "../potso/ttOrder";

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

  constructor(private _getDataService: GetDataService) { }

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
        console.log(error);
      }
      // , () => console.log("Resolved!")
      );
  }
}
