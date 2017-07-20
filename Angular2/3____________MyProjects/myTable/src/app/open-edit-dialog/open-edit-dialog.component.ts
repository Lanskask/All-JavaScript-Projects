import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

import { ttOrder } from '../potso/ttOrder';
import { RepresentOrdersDataComponent } 
  from '../represent-orders-data/represent-orders-data.component';

@Component({
  selector: 'app-open-edit-dialog',
  templateUrl: './open-edit-dialog/open-edit-dialog.component.html',
  styleUrls: ['./open-edit-dialog/open-edit-dialog.component.css']
})
export class OpenEditDialogComponent implements OnInit {

  constructor(
    public parentRepresenter: MdDialogRef<RepresentOrdersDataComponent>
    // @Inject(MD_DIALOG_DATA) public data: ttOrder
  ) { }

  ttOrderToTransfer: ttOrder;
  newTtOrder: ttOrder;
  oldTtOrder: ttOrder;
  ttOrderToTransferBack: ttOrder;
  
  saveBeOrder() {
    this.ttOrderToTransferBack = this.newTtOrder;
  }

  onCancel() {
    this.ttOrderToTransferBack = this.oldTtOrder;
  }

  ngOnInit() { 
    this.oldTtOrder = this.ttOrderToTransfer;
    this.newTtOrder = this.ttOrderToTransfer;
  }


}
