import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ttOrder } from '../../potso/ttOrder';
import { NgxExpComponent } from '../ngx-exp.component';
import { BasicFunctionsService } from '../../services/basic-functions.service';

@Component({
  selector: 'app-tt-order-edit-dialog',
  templateUrl: './tt-order-edit-dialog.component/tt-order-edit-dialog.component.html',
  styleUrls: ['./tt-order-edit-dialog.component/tt-order-edit-dialog.component.css']
})
export class TtOrderEditDialogComponent implements OnInit {

  ttOrderToTransfer: ttOrder;
  newTtOrder: ttOrder;
  oldTtOrder: ttOrder;
  ttOrderToTransferBack: ttOrder;

  constructor(
    public _basicFunctions: BasicFunctionsService, 
    public parentNgxExpTable: MdDialogRef<NgxExpComponent>
  ) { }

  saveBeOrder() {
    this.ttOrderToTransferBack = this.newTtOrder;
    console.log("this.newTtOrder: ", this.newTtOrder);
    console.log("this.ttOrderToTransferBack === this.newTtOrder: ", (this.ttOrderToTransferBack === this.newTtOrder));
  }

  onCancel() {
    this.ttOrderToTransferBack = this.oldTtOrder;
  }

  ngOnInit() {
    this.oldTtOrder = this._basicFunctions.deepCopy(this.ttOrderToTransfer);
    this.newTtOrder = this._basicFunctions.deepCopy(this.ttOrderToTransfer);
  }
}
