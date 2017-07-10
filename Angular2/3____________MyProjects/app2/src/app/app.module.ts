import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Comp2Component } from './comp2/comp2.component';

@NgModule({
	imports: [BrowserModule],
	declarations: [AppComponent, Comp2Component],
	bootstrap: [AppComponent],
})
export class AppModule {

}