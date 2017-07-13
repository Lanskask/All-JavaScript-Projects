import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { Module1Module } from './module1/module1.module';
import { Module2Module } from './module2/module2.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule, 
    Module2Module,
    Module1Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
