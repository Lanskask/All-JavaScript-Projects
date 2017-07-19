import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

import { ttOrder } from '../potso/ttOrder';

@Component({
  selector: 'app-open-edit-dialog',
  templateUrl: './open-edit-dialog/open-edit-dialog.component.html',
  styleUrls: ['./open-edit-dialog/open-edit-dialog.component.css']
})
export class OpenEditDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<OpenEditDialogComponent>
    , @Inject(MD_DIALOG_DATA) public data: ttOrder
  ) { }

  ttOrderInDialog: ttOrder = this.data;

  ngOnInit() {
  }

}
