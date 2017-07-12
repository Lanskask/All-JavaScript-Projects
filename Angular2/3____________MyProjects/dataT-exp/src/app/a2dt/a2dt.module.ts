import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';
import { A2DtComponent } from './a2dt.component';

@NgModule({
    imports: [
        DataTableModule, 
        // A2DtComponent
    ],
    exports: [A2DtComponent],
    providers: [
        A2DtComponent
    ],
    declarations: [A2DtComponent],
    bootstrap: [ A2DtComponent ]
})
export class A2DtModule { }