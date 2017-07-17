import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { BeOrderDialogComponent } from './be-order-dialog/be-order-dialog.component';

import { ttOrder } from '../potso/ttOrder';

@Component({
  selector: 'app-matmodule',
  templateUrl: './matmodule.component.html',
  styleUrls: ['./matmodule.component.css']
})
export class MatModuleComponent implements OnInit {
  public result: any;

  constructor(public _dialog: MdDialog ) {}

  openDialog() {
    this._dialog.open(BeOrderDialogComponent);
  }

  ngOnInit() {
  }

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

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