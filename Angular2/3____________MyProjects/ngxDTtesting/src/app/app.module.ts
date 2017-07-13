import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Module1Module } from './module1/module1.module';
import { Module2Module } from './module2/module2.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Module2Module,
    Module1Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
