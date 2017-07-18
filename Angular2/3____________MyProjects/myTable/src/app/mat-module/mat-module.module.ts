import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModuleComponent } from './mat-module.component';
import { CustomMaterialModule } from './custom-material.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MatModuleComponent]
})
export class MatModuleModule { }
