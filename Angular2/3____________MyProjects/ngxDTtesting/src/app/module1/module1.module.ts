import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Module1Component } from './module1.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Module1Component],
  exports: [
    Module1Component
  ] 
})
export class Module1Module { }
