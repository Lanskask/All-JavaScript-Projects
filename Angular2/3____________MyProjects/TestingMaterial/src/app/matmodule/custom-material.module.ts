import { NgModule } from '@angular/core';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MdDialogModule,
	MdGridListModule,
	MdSelectModule,
	MdInputModule,
	MdTabsModule
} from '@angular/material';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		MdDialogModule,
		MdGridListModule,
		MdSelectModule,
		MdInputModule,
		MdTabsModule,
	],
	exports: [
		BrowserAnimationsModule,
		MdDialogModule,
		MdGridListModule,
		MdSelectModule,
		MdInputModule,
		MdTabsModule,
	],
})
export class CustomMaterialModule { }