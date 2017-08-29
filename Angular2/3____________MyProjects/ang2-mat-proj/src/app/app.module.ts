import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdCheckboxModule } from '@angular/material';
import { DataTableModule } from 'angular2-datatable';

import { CustomMaterialModule } from './custom-material.module';
import { AppComponent } from './app.component';
import { GetOrdersService } from '../services/getOrders.service' ;

import 'hammerjs';
import { DataTablExamplComponent } from './data-tabl-exampl/data-tabl-exampl.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTablExamplComponent
  ],
  imports: [
    BrowserModule, 
    MaterialModule, MdButtonModule, MdCheckboxModule, 
    BrowserAnimationsModule,
    HttpModule,
    DataTableModule,
    CustomMaterialModule
  ],
  providers: [GetOrdersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
