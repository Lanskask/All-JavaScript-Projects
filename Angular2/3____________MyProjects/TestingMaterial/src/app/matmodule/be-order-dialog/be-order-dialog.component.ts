import { Component, OnInit } from '@angular/core';
import { MdDialogRef} from '@angular/material';

import { ttOrder } from '../../potso/ttOrder';

@Component({
  selector: 'app-be-order-dialog',
  templateUrl: './be-order-dialog.component.html',
  styleUrls: ['./be-order-dialog.component.css']
})
export class BeOrderDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<BeOrderDialogComponent>) { }

  ngOnInit() {
  }

  submit() {
    console.log(ttOrder);
  }

  ttOrder = new ttOrder(
    0, 
    "FlyByNight Courier", 
    "Master Card", 
    53, 
    "", 
    "1998-01-26", 
    "Shipped", 
    1, 
    "", 
    "1998-01-31", 
    "RDR", 
    "1998-01-31", 
    0, 
    "Net30", 
    0,  
  );
}