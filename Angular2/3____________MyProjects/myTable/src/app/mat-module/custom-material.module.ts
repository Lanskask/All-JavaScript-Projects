import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdCheckboxModule } from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule, MdCheckboxModule, MdMenuModule,
    BrowserAnimationsModule
  ],
  exports: [
    MdButtonModule, MdCheckboxModule, MdMenuModule,
    BrowserAnimationsModule
  ],
  declarations: []
})
export class CustomMaterialModule { }
