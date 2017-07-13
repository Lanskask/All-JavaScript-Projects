import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Module2Component } from './module2.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Module2Component],
  exports: [
    Module2Component
  ] 
})
export class Module2Module { }
