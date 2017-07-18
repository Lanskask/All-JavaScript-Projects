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

  ttOrders: ttOrder[] = [];
  error:any;

  constructor(private _getDataService: GetDataService) { }

  ngOnInit() {
    this._getDataService.getUsers()
      .subscribe(
      data => {
        this.ttOrders = data;
        console.log("Log 1. ttOrders in represent-orders-data in success: " + this.ttOrders);
      },
      error => {
        this.error = error;
        console.log(error);
      }
      );

    console.log("Log 2. ttOrders in represent-orders-data" + this.ttOrders);
  }

}
