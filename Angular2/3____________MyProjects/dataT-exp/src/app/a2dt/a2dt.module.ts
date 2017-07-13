import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'angular2-datatable';

import { A2DtComponent } from './a2dt.component';
import { DataFilterPipe } from  './data-filter.pipe';

@NgModule({
    imports: [
        DataTableModule,
        FormsModule,
        // DataFilterPipe
        // A2DtComponent
        HttpModule,
        CommonModule
    ],
    exports: [A2DtComponent],
    providers: [
        A2DtComponent
    ],
    declarations: [
        A2DtComponent, 
        DataFilterPipe
    ],
    bootstrap: [A2DtComponent]
})
export class A2DtModule { }