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

import { AppComponent } from './app.component';
import { GetDataService } from './services/get-data.service';
import { RepresentOrdersDataComponent }
  from './represent-orders-data/represent-orders-data.component';
import { NgxExpComponent } from './ngx-exp/ngx-exp.component';
import { OpenEditDialogComponent } 
  from './open-edit-dialog/open-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RepresentOrdersDataComponent,
    NgxExpComponent,
    OpenEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MdTableModule, MdToolbarModule, MdDialogModule,
    FormsModule,
    MdInputModule
  ],
  providers: [
    GetDataService, 
    MdDialog, 
    // OVERLAY_PROVIDERS
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    OpenEditDialogComponent
  ]
})
export class AppModule { }
