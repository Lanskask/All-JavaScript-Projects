import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'hammerjs';
import { MdTableModule, MdToolbarModule } from '@angular/material';
import { MdDialog, MdDialogModule, MdInputModule,
 } from '@angular/material';
import {OVERLAY_PROVIDERS} from "@angular/material";
import { NgForm, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { GetDataService } from './services/get-data.service';
import { BasicFunctionsService } from './services/basic-functions.service';
import { RepresentOrdersDataComponent }
  from './represent-orders-data/represent-orders-data.component';
import { NgxExpComponent } from './ngx-exp/ngx-exp.component';
import { OpenEditDialogComponent } 
  from './represent-orders-data/open-edit-dialog/open-edit-dialog.component';
import { TtOrderEditDialogComponent } from 
  './ngx-exp/tt-order-edit-dialog/tt-order-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RepresentOrdersDataComponent,
    NgxExpComponent,
    OpenEditDialogComponent,
    TtOrderEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MdTableModule, MdToolbarModule, MdDialogModule, MdInputModule,
    FormsModule,
    NgxDatatableModule,
    Ng2SmartTableModule
  ],
  providers: [
    GetDataService, 
    BasicFunctionsService,
    MdDialog, 
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    OpenEditDialogComponent, 
    TtOrderEditDialogComponent
  ]
})
export class AppModule { }
