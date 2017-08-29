import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';

import { AppComponent } from './app.component';
import { ProductService } from './products.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, GridModule, ExcelModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
