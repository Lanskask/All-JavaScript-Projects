import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { AppComponent } from './app.component';
import { GetDataService } from './services/get-data.service';
import { RepresentOrdersDataComponent } 
  from './represent-orders-data/represent-orders-data.component';

@NgModule({
  declarations: [
    AppComponent,
    RepresentOrdersDataComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
