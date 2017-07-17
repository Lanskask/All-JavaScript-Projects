import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdDialogModule, MdGridListModule, MdSelectModule } from '@angular/material';
import 'hammerjs';

import { MatModuleComponent } from './matmodule.component';
import { BeOrderDialogComponent } from './src/app/matmodule/be-order-dialog/be-order-dialog.component';

@NgModule({
  imports: [
    CommonModule, 
    BrowserAnimationsModule,
    MdDialogModule,
    MdGridListModule,
    MdSelectModule
  ],
  declarations: [MatModuleComponent, BeOrderDialogComponent],
  exports: [MatModuleComponent]
})
export class MatModuleModule { }
