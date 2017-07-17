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
import { NgForm, FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		MdDialogModule,
		MdGridListModule,
		MdSelectModule,
		MdInputModule,
		MdTabsModule,
		NgForm, FormsModule
	],
	exports: [
		BrowserAnimationsModule,
		MdDialogModule,
		MdGridListModule,
		MdSelectModule,
		MdInputModule,
		MdTabsModule,
		NgForm, FormsModule
	],
})
export class CustomMaterialModule { }