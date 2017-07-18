import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../services/get-data.service';

import { dsOrder } from "../potso/dsOrder";
import { ttOrder } from "../potso/ttOrder";

@Component({
  selector: 'app-represent-orders-data',
  templateUrl: './represent-orders-data.component/represent-orders-data.component.html',
  styleUrls: ['./represent-orders-data.component/represent-orders-data.component.css']
})
export class RepresentOrdersDataComponent implements OnInit {

  constructor(private _getDataService: GetDataService) { }

  ttOrders: ttOrder[] = [];
  error:any;

  ngOnInit() {
    this._getDataService.getUsers()
      .subscribe(
        data => this.ttOrders = data,
        error => { this.error = error; console.log(error); }
      );

    console.log(this.ttOrders);
  }

}
