import { NgModule } from '@angular/core';
import 'hammerjs';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdDialogModule,
  MdGridListModule,
  MdSelectModule,
  MdInputModule,
  MdTabsModule
} from '@angular/material';
import { NgForm, FormsModule } from '@angular/forms';

import { MatModuleComponent } from './matmodule.component';
import { BeOrderDialogComponent } 
  from './be-order-dialog/be-order-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MdDialogModule,
    MdGridListModule,
    MdSelectModule,
    FormsModule,
    MdInputModule,
    MdTabsModule,
  ],
  declarations: [MatModuleComponent, BeOrderDialogComponent],
  exports: [MatModuleComponent],
  entryComponents: [
    BeOrderDialogComponent
  ]
})
export class MatModuleModule { }
