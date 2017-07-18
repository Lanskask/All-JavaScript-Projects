import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { MdTableModule, MdToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { GetDataService } from './services/get-data.service';
import { RepresentOrdersDataComponent }
  from './represent-orders-data/represent-orders-data.component';
import { NgxExpComponent } from './ngx-exp/ngx-exp.component';

@NgModule({
  declarations: [
    AppComponent,
    RepresentOrdersDataComponent,
    NgxExpComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MdTableModule, MdToolbarModule
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
