import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';

import { CustomMaterialModule } from './custom-material.module';
import { MatModuleComponent } from './matmodule.component';
import { BeOrderDialogComponent } 
  from './be-order-dialog/be-order-dialog.component';
import { TableModule } from './table/table.module';

@NgModule({
  imports: [
    CustomMaterialModule,
    CommonModule,
    TableModule,
    FormsModule 
  ],
  declarations: [MatModuleComponent, BeOrderDialogComponent],
  exports: [MatModuleComponent, TableModule],
  entryComponents: [
    BeOrderDialogComponent
  ]
})
export class MatModuleModule { }
