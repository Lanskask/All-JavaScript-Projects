import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

import { ttOrder } from '../potso/ttOrder';
import { RepresentOrdersDataComponent }
  from '../represent-orders-data/represent-orders-data.component';
import { BasicFunctionsService } from '../services/basic-functions.service';

@Component({
  selector: 'app-open-edit-dialog',
  templateUrl: './open-edit-dialog/open-edit-dialog.component.html',
  styleUrls: ['./open-edit-dialog/open-edit-dialog.component.css']
})
export class OpenEditDialogComponent implements OnInit {

  constructor(
    public _basicFunctions: BasicFunctionsService, 
    public parentRepresenter: MdDialogRef<RepresentOrdersDataComponent>
    // @Inject(MD_DIALOG_DATA) public data: ttOrder
  ) { }

  ttOrderToTransfer: ttOrder;
  newTtOrder: ttOrder;
  oldTtOrder: ttOrder;
  ttOrderToTransferBack: ttOrder;

  saveBeOrder() {
    this.ttOrderToTransferBack = this.newTtOrder;
    // console.log(this.newTtOrder);
    // console.log("saveBeOrder: " + (this.ttOrderToTransferBack === this.newTtOrder));
  }

  onCancel() {
    this.ttOrderToTransferBack = this.oldTtOrder;
  }

  ngOnInit() {
    this.oldTtOrder = this._basicFunctions.deepCopy(this.ttOrderToTransfer);
    this.newTtOrder = this._basicFunctions.deepCopy(this.ttOrderToTransfer);
  }

}
