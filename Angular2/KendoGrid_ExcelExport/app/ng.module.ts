import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { AppComponent } from './app.component';

import { ProductService } from './pruducts.service';

@NgModule({
  imports:      [ BrowserModule, GridModule, ExcelModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ProductService]
})
export class AppModule { }