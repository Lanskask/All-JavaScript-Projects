import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdDialogModule, MdGridListModule, MdSelectModule } from '@angular/material';
import 'hammerjs';

import { MatModuleComponent } from './matmodule.component';

@NgModule({
  imports: [
    CommonModule, 
    BrowserAnimationsModule,
    MdDialogModule,
    MdGridListModule,
    MdSelectModule
  ],
  declarations: [MatModuleComponent],
  exports: [MatModuleComponent]
})
export class MatModuleModule { }
