import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matmodule',
  templateUrl: './matmodule.component.html',
  styleUrls: ['./matmodule.component.css']
})
export class MatModuleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}
